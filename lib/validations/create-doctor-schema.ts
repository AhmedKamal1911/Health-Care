import { z } from "zod";
import { validateImageDimensions } from "../utils";
export const ImageValidTypes = ["image/jpeg", "image/png"];
export const imageFileSchema = z
  .instanceof(File, {
    message: "Image is requierd",
  })
  // .nullable()
  .refine((file) => (!file ? true : ImageValidTypes.includes(file.type)), {
    message: "Image must be jpeg,png only",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image size must be less than or equal 5mb",
  });

export const createDoctorSchema = z.object({
  doctorName: z.string().min(1, "Doctor Name is Required"),
  specialty: z.string().min(1, "Doctor Specialty Required"),
  phoneNumber: z
    .string({ required_error: "Phone number is Required." })
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
  experience: z.string().min(1, "Experience is Required"),
  email: z
    .string()
    .min(8, {
      message: "Email must be at least 8 characters.",
    })
    .email("This Email is not valid"),

  avatarImage: imageFileSchema.refine(
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
  startWorkingDate: z.date(),
});

export type createDoctorType = z.infer<typeof createDoctorSchema>;
