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

import { Response } from "../types/types";
import { Permission, Role } from "node-appwrite";

import { getSessionCookie } from "../helpers/auth";
import { revalidatePath } from "next/cache";

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
  const result = PatientScheduleAppointmentSchema.safeParse(appointment);
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
