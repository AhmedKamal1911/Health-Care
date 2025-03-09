"use server";

import {
  APPOINTMENT_COLLECTION_ID,
  createAdminClient,
  createClientSession,
  DATABASE_ID,
  ID,
  PATIENT_COLLECTION_ID,
} from "../appwrite";

import {
  PatientFormInputs,
  PatientFormSchema,
} from "../validations/patient-form-schema";

import { NetworkError, Response } from "../types/types";
import {
  PatientRegisterFormInputsValues,
  patientRegisterFormInputsValuesSchema,
} from "../validations/patient-register-form-schema";

import { handleErrorMessage } from "../utils";
import { Models } from "node-appwrite";
import { UserDTO } from "../types/user";
import { getSessionCookie } from "../helpers/auth";
import { revalidatePath } from "next/cache";
import { Appointment } from "../types/appointment";
import { PatientScheduleAppointmentTypes } from "../validations/new-appointment-schema";

type UserResponse = Response<UserDTO, PatientFormInputs>;

export const createUser = async (
  user: Omit<PatientFormInputs, "confirmPassword">
): UserResponse => {
  const validationResult = PatientFormSchema.safeParse(user);
  if (!validationResult.success) {
    return {
      status: "validationError",
      error: validationResult.error.flatten().fieldErrors,
    };
  }
  try {
    const { users } = createAdminClient();
    const result = await users.create(
      ID.unique(),
      user.email, // email (optional)
      user.phoneNumber, // phone (optional)
      user.password, // password (optional)
      user.fullName // name (optional)
    );
    users.updateLabels(result.$id, ["patient"]);

    return {
      status: "success",
      data: {
        id: result.$id,
        email: result.email,
        name: result.name,
        emailVerification: result.emailVerification,
        phone: result.phone,
        phoneVerification: result.phoneVerification,
        registrationDate: new Date(result.registration),
        updatedAt: new Date(result.$updatedAt),
        createdAt: new Date(result.$createdAt),
      },
    };
  } catch (error) {
    const { message, status } = handleErrorMessage(error);

    return { error: { status, message }, status: "NetworkError" };
  }
};

type RegisterPatientResponse = Response<
  Models.Document,
  PatientRegisterFormInputsValues
>;

export const registerPatient = async (
  patient: PatientRegisterFormInputsValues,
  userId: string
): RegisterPatientResponse => {
  try {
    const { databases } = createAdminClient();
    const result = patientRegisterFormInputsValuesSchema.safeParse(patient);

    if (!result.success) {
      return {
        status: "validationError",
        error: result.error.flatten().fieldErrors,
      };
    }
    const newPatientDocument = await databases.createDocument(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      userId,
      {
        ...patient,
        identificationDocument: `/api/files/${patient.identificationDocument}`,
      }
    );

    return { status: "success", data: newPatientDocument };
  } catch (error) {
    const { status, message } = handleErrorMessage(error);
    return {
      status: "NetworkError",
      error: {
        message,
        status,
      },
    };
  }
};

export type CancelAppointmentResponse = Promise<
  { success: true } | { success: false; error: NetworkError["error"] }
>;

export const cancelPatientAppointment = async (
  prevState: unknown,
  appointmentId: string
): CancelAppointmentResponse => {
  try {
    const session = await getSessionCookie();
    console.log({ appointmentId });
    const { databases, account } = createClientSession(session);
    const patientId = (await account.get()).$id;

    const result = await databases.updateDocument<Appointment>(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      appointmentId,
      { status: "cancelled", patient: patientId }
    );
    console.log({ result });
    revalidatePath("/dashboard/patient");
    return { success: true };
  } catch (error) {
    const { message, status, statusText } = handleErrorMessage(error);
    return { error: { message, status, statusText }, success: false };
  }
};

type UpdatePatientAppointmentResponse = Response<
  undefined,
  PatientScheduleAppointmentTypes
>;
export const updatePatientAppointment = async (
  updatedData: PatientScheduleAppointmentTypes,
  appointmentId: string
): UpdatePatientAppointmentResponse => {
  try {
    const session = await getSessionCookie();

    const { databases } = createClientSession(session);

    const result = await databases.updateDocument<Appointment>(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      appointmentId,
      {
        doctor: updatedData.doctor,
        appointmentReason: updatedData.appointmentReason,
        appointmentDate: updatedData.appointmentDate,
      }
    );
    console.log({ result });
    revalidatePath("/dashboard/patient");

    return { status: "success", data: undefined };
  } catch (error) {
    const { message, status, statusText } = handleErrorMessage(error);
    return { error: { message, status, statusText }, status: "NetworkError" };
  }
};
