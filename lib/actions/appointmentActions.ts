"use server";

import {
  APPOINTMENT_COLLECTION_ID,
  createAdminClient,
  createClientSession,
  DATABASE_ID,
  ID,
} from "../appwrite";
import { handleErrorMessage } from "../utils";
import {
  NewAppointmentDTO,
  NewAppointmentSchema,
  NewAppointmentSchemaTypes,
  PatientScheduleAppointmentSchema,
  PatientScheduleAppointmentTypes,
} from "../validations/new-appointment-schema";
import { Appointment } from "../types/appointment";

import { NetworkError, Response } from "../types/types";
import { Permission, Role } from "node-appwrite";

import { getSessionCookie } from "../helpers/auth";
import { revalidatePath } from "next/cache";
import { CancellationSchema } from "../validations/admin-actions-schema";

type AppointmentResponse = Response<{ id: string }, NewAppointmentSchemaTypes>;

function toDTOMapper(appointmentDocument: Appointment): NewAppointmentDTO {
  return {
    id: appointmentDocument.$id,
    createdAt: new Date(appointmentDocument.$createdAt),
    updatedAt: new Date(appointmentDocument.$updatedAt),
    additionalComments: appointmentDocument.additionalComments,
    appointmentDate: new Date(appointmentDocument.appointmentDate),
    appointmentReason: appointmentDocument.appointmentReason,
    doctor: appointmentDocument.doctor,
  };
}
// THIS ACTION IS BY SYSTEM
export const createAppointment = async (
  appointment: NewAppointmentSchemaTypes,
  patientId: string
): AppointmentResponse => {
  const result = NewAppointmentSchema.safeParse(appointment);
  if (!result.success) {
    return {
      status: "validationError",
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const { databases } = createAdminClient();
    const appointmentDoc: Appointment = await databases.createDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      ID.unique(),
      { ...appointment, patient: patientId },
      [
        Permission.read(Role.user(patientId)), // Anyone can view this document
        Permission.update(Role.user(patientId)), // Writers can update this document
        Permission.delete(Role.user(patientId)), // Admins can update this document
      ]
    );

    return { data: { id: appointmentDoc.$id }, status: "success" };
  } catch (error) {
    const { status, message } = handleErrorMessage(error);
    return {
      status: "NetworkError",
      error: { status, message },
    };
  }
};

// THIS ACTION IS BY Patient

type PatientAppointmentResponse = Response<
  { id: string },
  PatientScheduleAppointmentTypes
>;

export const createPatientAppointment = async (
  appointment: PatientScheduleAppointmentTypes
): PatientAppointmentResponse => {
  console.log({ appointment });
  const result = PatientScheduleAppointmentSchema.safeParse(appointment);
  console.log({ result });
  if (!result.success) {
    return {
      status: "validationError",
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const session = await getSessionCookie();
    const { databases, account } = createClientSession(session);
    const patientId = (await account.get()).$id;
    const appointmentDoc: Appointment = await databases.createDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      ID.unique(),
      { ...appointment, patient: patientId }
    );
    console.log("from patient action", { appointmentDoc });
    revalidatePath("/dashboard/patient");
    return { data: { id: appointmentDoc.$id }, status: "success" };
  } catch (error) {
    const { status, message } = handleErrorMessage(error);
    return {
      status: "NetworkError",
      error: { status, message },
    };
  }
};

type ScheduleAppointmentResponse = Promise<
  { status: "success" } | NetworkError | undefined
>;
// THIS ACTION IS BY SYSTEM TO SCHEDULE APPOINTMENT
export const scheduleAppointment = async (
  prevState,
  appointmentId: string
): ScheduleAppointmentResponse => {
  try {
    const { databases } = createAdminClient();
    await databases.updateDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      appointmentId,
      {
        status: "scheduled",
      }
    );
    revalidatePath("/dashboard/admin");
    return { status: "success" };
  } catch (error) {
    const { status, message } = handleErrorMessage(error);
    return {
      status: "NetworkError",
      error: { status, message },
    };
  }
};
type DeleteAppointmentResponse = Promise<{ status: "success" } | NetworkError>;
// THIS ACTION IS BY SYSTEM to Delete Appointment
export const adminDeleteAppointment = async (
  prevState,
  appointmentId: string
): DeleteAppointmentResponse => {
  try {
    console.log({ appointmentId });
    const { databases } = createAdminClient();

    const result = await databases.deleteDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      appointmentId
    );
    console.log({ result });
    revalidatePath("/dashboard/admin");
    return { status: "success" };
  } catch (error) {
    const { message, status, statusText } = handleErrorMessage(error);
    return { error: { message, status, statusText }, status: "NetworkError" };
  }
};

// THIS ACTION IS BY SYSTEM TO CANCEL APPOINTMENT
type CancelAppointmentResponse = Response<undefined, CancellationSchema>;
export const adminCancelAppointment = async (
  cancellationReason: string,
  patientId: string,
  appointmentId: string
): CancelAppointmentResponse => {
  try {
    const { databases } = createAdminClient();
    console.log({ appointmentId, cancellationReason });

    const result = await databases.updateDocument<Appointment>(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      appointmentId,
      {
        cancellationReason: cancellationReason,
        status: "cancelled",
        patient: patientId,
      }
    );

    revalidatePath("/dashboard/patient");
    revalidatePath("/dashboard/admin");

    return { data: undefined, status: "success" };
  } catch (error) {
    const { message, status, statusText } = handleErrorMessage(error);
    return { error: { message, status, statusText }, status: "NetworkError" };
  }
};
