import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email address" })
    .email(),
  password: z.string().min(1, { message: "Please enter your password" }),
});

export type LoginFormSchemaInputs = z.infer<typeof LoginFormSchema>;
