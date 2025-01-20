import { z } from "zod";
import { dateValidation } from "../validations/common";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  emailVerification: z.boolean(),
  phoneVerification: z.boolean(),
  registrationDate: dateValidation,
  createdAt: dateValidation,
  updatedAt: dateValidation,
});

export type UserDTO = z.infer<typeof userSchema>;
