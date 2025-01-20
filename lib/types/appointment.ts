import { Models } from "node-appwrite";

import { Doctor } from "./doctor";
import { z } from "zod";
import { dateValidation } from "../validations/common";
import { Patient, patientDTOSchema } from "./patient";
import { APPOINTMENT_STATUS_TUPLE } from "../data";
import { AppointmentStatus } from "./types";

export type Appointment = Models.Document & {
  doctor: Doctor;
  additionalComments: string;
  appointmentReason: string;
  appointmentDate: string;
  patient: Patient;
  status: AppointmentStatus;
};

export const appointmentDTOSchema = z.object({
  id: z.string(),
  updatedAt: dateValidation,
  createdAt: dateValidation,
  doctor: z
    .object({
      id: z.string(),
      avatarImage: z.string().nullable().optional(),
      specialty: z.string(),
      phoneNumber: z.string(),
      doctorName: z.string(),
    })
    .optional(),
  additionalComments: z.string(),
  appointmentReason: z.string(),
  appointmentDate: dateValidation,
  patient: patientDTOSchema,
  status: z.enum(APPOINTMENT_STATUS_TUPLE).optional(), // Allow undefined
});
export type AppointmentDTO = z.infer<typeof appointmentDTOSchema>;
