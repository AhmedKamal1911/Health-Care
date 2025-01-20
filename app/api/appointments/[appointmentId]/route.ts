import {
  APPOINTMENT_COLLECTION_ID,
  createAdminClient,
  DATABASE_ID,
} from "@/lib/appwrite";
import { Appointment, AppointmentDTO } from "@/lib/types/appointment";
import { Doctor, DoctorDTO } from "@/lib/types/doctor";
import { Patient, PatientDTO } from "@/lib/types/patient";
import { handleErrorMessage } from "@/lib/utils";

import { NextRequest, NextResponse } from "next/server";

function toDTOMapper(appointment: Appointment): AppointmentDTO {
  return {
    id: appointment.$id,
    updatedAt: new Date(appointment.$updatedAt),
    createdAt: new Date(appointment.$createdAt),
    doctor: toDoctorDTOMapper(appointment.doctor),
    patient: toPatientDTOMapper(appointment.patient),
    additionalComments: appointment.additionalComments,
    appointmentReason: appointment.appointmentReason,
    appointmentDate: new Date(appointment.appointmentDate),
  };
}
function toDoctorDTOMapper(doctor: Doctor): DoctorDTO {
  return {
    id: doctor.$id,
    doctorName: doctor.doctorName,
    phoneNumber: doctor.phoneNumber,
    specialty: doctor.specialty,
    avatarImage: doctor.avatarImage,
  };
}
function toPatientDTOMapper(patient: Patient): PatientDTO {
  return {
    id: patient.$id,
    name: patient.fullName,
    address: patient.address,
    createdAt: patient.$createdAt,
    dateOfBirth: patient.birthDate,
    email: patient.email,
    emergencyContactName: patient.emergencyContactName,
    gender: patient.gender,
    occupation: patient.occupation,
    phoneNumber: patient.phoneNumber,
    privacyConsent: patient.privacyConsent,
    updatedAt: patient.$updatedAt,
    alleriges: patient.alleriges,
    currentMedications: patient.currentMedications,
    familyMedicalHistory: patient.familyMedicalHistory,
    identificationDocumentUrl: patient.identificationDocument,
    identificationNumber: patient.identificationNumber,
    identificationType: patient.identificationType,
    pastMedicalHistory: patient.pastMedicalHistory,
    primaryPhyisician: patient.primaryPhyisician,
  };
}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  if (!appointmentId)
    return new NextResponse(
      JSON.stringify({
        error: "Invalid Appointment id",
      }),
      {
        status: 400,
        statusText: "Bad Request",
      }
    );

  try {
    const { databases } = createAdminClient();
    const appointment: Appointment & { patient: PatientDTO } =
      await databases.getDocument(
        DATABASE_ID,
        APPOINTMENT_COLLECTION_ID,
        appointmentId
      );

    return NextResponse.json(toDTOMapper(appointment));
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
