import { z } from "zod";
import { validateImageDimensions } from "../utils";

export const documentValidTypes = [
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/svg+xml",
];
export const documentFileSchema = z
  .instanceof(File, {
    message: "identification document is requierd",
  })
  // .nullable()
  .refine((file) => (!file ? true : documentValidTypes.includes(file.type)), {
    message: "identification document must be jpeg,gif,png,svg only",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "identification document size must be less than or equal 5mb",
  });

export const patientRegisterFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z
    .string()
    .min(8, {
      message: "Email must be at least 8 characters.",
    })
    .email("This Email is not valid"),
  address: z.string().min(2, {
    message: "Address is requierd",
  }),
  emergencyContactName: z.string().min(2, {
    message: "Emergency contact name is requierd",
  }),
  birthDate: z.date(),
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
  occupation: z.string().min(2, {
    message: "Occupation is requierd",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "You need to select a notification type.",
  }),
  primaryPhyisician: z.string().min(2, {
    message: "Primary Care Physician is requierd",
  }),

  allergies: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  currentMedications: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().min(2, {
    message: "Identification number is requierd",
  }),
  identificationDocument: documentFileSchema.refine(
    async (file) => {
      if (typeof window !== "undefined") {
        return await validateImageDimensions(
          file,
          ({ width, height }) => width <= 800 && height <= 600
        );
      } else {
        return true;
      }
    },
    {
      message: "image must be max 800 pixel width and 600 pixel height",
    }
  ),
  privacyConsent: z
    .boolean()
    .refine((value) => value, { message: "you must agree all consents" }),
});

export type PatientRegisterFormInputs = z.infer<
  typeof patientRegisterFormSchema
>;

export const patientRegisterFormInputsValuesSchema = patientRegisterFormSchema
  .omit({ identificationDocument: true })
  .and(z.object({ identificationDocument: z.string() }));

export type PatientRegisterFormInputsValues = z.infer<
  typeof patientRegisterFormInputsValuesSchema
>;
