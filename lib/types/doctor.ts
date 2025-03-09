import { Models } from "node-appwrite";
import { z } from "zod";

import { Appointment, appointmentDTOSchema } from "./appointment";

export type Doctor = Models.Document & {
  avatarImage: string;
  specialty: string;
  phoneNumber: string;
  doctorName: string;
  appointments: Omit<Appointment, "doctor">[];
  startWorkingDate: Date;
  experience: string;
  email: string;
};

export const doctorDTOSchema = z.object({
  id: z.string(),
  avatarImage: z.string(),
  specialty: z.string(),
  phoneNumber: z.string(),
  doctorName: z.string(),
  appointments: z.array(appointmentDTOSchema).optional(),
  startWorkingDate: z.date(),
  experience: z.string(),
  email: z.string().email(),
});

export type DoctorDTO = z.infer<typeof doctorDTOSchema>;
