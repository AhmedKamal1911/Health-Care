import {
  createAdminClient,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
} from "@/lib/appwrite";
import { Patient, PatientDTO } from "@/lib/types/patient";
import { handleErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

function toDTOMapper(patient: Patient): PatientDTO {
  return {
    id: patient.$id,
    updatedAt: patient.$updatedAt,
    createdAt: patient.$createdAt,
    name: patient.fullName,
    email: patient.email,
    dateOfBirth: patient.birthDate,
    phoneNumber: patient.phoneNumber,
    address: patient.address,
    privacyConsent: patient.privacyConsent,
    gender: patient.gender,
    occupation: patient.occupation,
    emergencyContactName: patient.emergencyContactName,
    alleriges: patient.alleriges,
    currentMedications: patient.currentMedications,
    familyMedicalHistory: patient.familyMedicalHistory,
    pastMedicalHistory: patient.pastMedicalHistory,
    identificationType: patient.identificationType,
    identificationNumber: patient.identificationNumber,
    identificationDocumentUrl: patient.identificationDocument,
    primaryPhyisician: patient.primaryPhyisician,
    appointments: patient.appointments,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const { patientId } = await params;
  if (!patientId)
    return new NextResponse(
      JSON.stringify({
        error: "Invalid patient id",
      }),
      {
        status: 400,
        statusText: "Bad Request",
      }
    );

  try {
    const { databases } = createAdminClient();
    const patient: Patient = await databases.getDocument(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      patientId
    );

    return NextResponse.json(toDTOMapper(patient));
  } catch (error) {
    const { status, message, statusText } = handleErrorMessage(error);
    return NextResponse.json(
      {
        message,
      },
      { status, statusText }
    );
  }
}
