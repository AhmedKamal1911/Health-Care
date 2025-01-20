import { z } from "zod";
import { Gender } from "./types";
import { GENDER_LIST } from "../data";
import { Models } from "node-appwrite";
import { dateValidation } from "../validations/common";
import { Appointment } from "./appointment";

export type Patient = Models.Document & {
  fullName: string;
  email: string;
  birthDate: Date;
  phoneNumber: string;
  address: string;
  privacyConsent: boolean;
  gender: Gender;
  occupation: string;
  emergencyContactName: string;
  alleriges: string;
  currentMedications: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: string | undefined;
  primaryPhyisician: string | undefined;
  appointments: Appointment[];
};

export const patientDTOSchema = z.object({
  id: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
  name: z.string(),
  email: z.string().email(),
  dateOfBirth: dateValidation,
  phoneNumber: z.string(),
  address: z.string(),
  privacyConsent: z.boolean(),
  gender: z.enum(GENDER_LIST),
  occupation: z.string(),
  emergencyContactName: z.string(),
  alleriges: z.string().optional(),
  currentMedications: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocumentUrl: z.string().optional(),
  primaryPhyisician: z.string().optional(),
});

export type PatientDTO = z.infer<typeof patientDTOSchema>;
