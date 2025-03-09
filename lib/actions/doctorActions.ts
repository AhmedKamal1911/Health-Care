"use server";

import {
  BUCKET_ID,
  createAdminClient,
  DATABASE_ID,
  DOCTOR_COLLECTION_ID,
  ID,
} from "../appwrite";
import {
  createDoctorSchema,
  createDoctorType,
} from "../validations/create-doctor-schema";
import { NetworkError, Response } from "../types/types";
import { handleErrorMessage } from "../utils";
import { revalidatePath } from "next/cache";

type CreateNewDoctorResponse = Response<
  { status: "Created" },
  createDoctorType
>;
export async function createNewDoctor(
  values: createDoctorType,
  imageId: string
): CreateNewDoctorResponse {
  try {
    const { databases, users } = createAdminClient();

    const userResult = await users.create(
      ID.unique(),
      values.email, // email (optional)
      values.phoneNumber, // phone (optional),
      undefined,
      values.doctorName // name (optional)
    );
    users.updateLabels(userResult.$id, ["doctor"]);

    const result = await createDoctorSchema.safeParseAsync(values);
    if (!result.success) {
      return {
        status: "validationError",
        error: result.error.flatten().fieldErrors,
      };
    }
    const response = await databases.createDocument(
      DATABASE_ID,
      DOCTOR_COLLECTION_ID,
      userResult.$id,
      { ...values, avatarImage: imageId }
    );

    revalidatePath("/dashboard/doctors");

    console.log({ response, imageId });
    return { data: { status: "Created" }, status: "success" };
  } catch (error) {
    const { message, status, statusText } = handleErrorMessage(error);
    return { status: "NetworkError", error: { message, status, statusText } };
  }
}

type DeleteAppointmentResponse = Promise<{ status: "success" } | NetworkError>;
export const adminDeleteDoctor = async (
  prevState,
  { doctorId, avatarImageId }: { doctorId: string; avatarImageId: string }
): DeleteAppointmentResponse => {
  try {
    console.log({ doctorId });
    const { databases, users, storage } = createAdminClient();
    const result = await databases.deleteDocument(
      DATABASE_ID,
      DOCTOR_COLLECTION_ID,
      doctorId
    );
    await users.delete(doctorId);
    await storage.deleteFile(BUCKET_ID, avatarImageId);
    console.log({ result });
    revalidatePath("/dashboard/doctors");
    return { status: "success" };
  } catch (error) {
    const { message, status, statusText } = handleErrorMessage(error);
    return { error: { message, status, statusText }, status: "NetworkError" };
  }
};
