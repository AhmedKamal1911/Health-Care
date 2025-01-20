import { z } from "zod";
import { dateValidation } from "./common";
import { doctorDTOSchema } from "../types/doctor";
import { patientDTOSchema } from "../types/patient";

export const NewAppointmentSchema = z.object({
  doctor: z.string().min(1, "Please select a doctor"),
  appointmentReason: z
    .string()
    .min(1, "Please enter a reason for the appointment"),
  additionalComments: z.string().optional(),
  appointmentDate: z.date(),
});

export type NewAppointmentSchemaTypes = z.infer<typeof NewAppointmentSchema>;

export const NewAppointmentDTOSchema = z.object({
  id: z.string(),
  updatedAt: dateValidation,
  createdAt: dateValidation,
  doctor: doctorDTOSchema,
  additionalComments: z.string(),
  appointmentReason: z.string().optional(),
  appointmentDate: dateValidation,
  patient: patientDTOSchema,
});

export type NewAppointmentDTO = z.infer<typeof NewAppointmentDTOSchema>;

// For singed in patient
export const PatientScheduleAppointmentSchema = z.object({
  doctor: z.string().min(1, "Please select a doctor"),
  appointmentReason: z
    .string()
    .min(1, "Please enter a reason for the appointment"),
  appointmentDate: z.date(),
});

export type PatientScheduleAppointmentTypes = z.infer<
  typeof PatientScheduleAppointmentSchema
>;
