import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]/, {
    message: "Password must include at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must include at least one lowercase letter.",
  })
  .regex(/\d/, { message: "Password must include at least one number." })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: "Password must include at least one special character.",
  });

export const PatientFormSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z
      .string()
      .min(8, {
        message: "Email must be at least 8 characters.",
      })
      .email("This Email is not valid"),
    phoneNumber: z
      .string({ required_error: "Phone number is required." })
      .min(8, {
        message: "Phone number must be at least 8 digits long.",
      })
      .max(15, {
        message: "Phone number must not exceed 15 digits.",
      })
      .regex(
        /^\+?2\d{7,14}$/,
        "Please enter a valid phone number with an optional '+' followed by 8 to 15 digits."
      ),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords doesn't match",
    path: ["confirmPassword"],
  });

export type PatientFormInputs = z.infer<typeof PatientFormSchema>;
