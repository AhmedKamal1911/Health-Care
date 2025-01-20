import { z } from "zod";
import { dateValidation } from "../validations/common";

export const loggedInUserSchema = z.object({
  createdAt: dateValidation,
  jwt: z.string(),
  userId: z.string(),
  email: z.string().email(),
});

export type AuthDTO = z.infer<typeof loggedInUserSchema>;
