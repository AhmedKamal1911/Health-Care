import { patientDTOSchema } from "../types/patient";

export async function getPatient(patientId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/patients/${patientId}`
    );

    if (!response.ok && response.status === 404) return undefined;
    const patient = await response.json();
    const result = patientDTOSchema.safeParse(patient);
    if (!result.success) {
      console.error(result.error.issues);

      throw new Error("Unexpected error happend...");
    }
    return result.data;
  } catch (error) {
    throw error;
  }
}
