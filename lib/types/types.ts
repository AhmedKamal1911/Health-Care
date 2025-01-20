import { AriaAttributes } from "react";
import { typeToFlattenedError } from "zod";
import { APPOINTMENT_STATUS } from "../data";

export type Gender = "male" | "female" | "other";

export type User = {
  id: string;
  email: string;
  emailVerification: boolean;
  name: string;
  phone: string;
  phoneVerification: boolean;
  registrationDate: string;
};

export type FormControlAria = {
  "aria-describedby"?: AriaAttributes["aria-describedby"];
  "aria-invalid"?: AriaAttributes["aria-invalid"];
};

export type NetworkError = {
  status: "NetworkError";
  error: {
    status: number;
    message: string;
    statusText?: string;
  };
};

type ResponseSuccess<T> = {
  status: "success";
  data: T;
};

type ValidationError<T extends Record<string, unknown>> = {
  status: "validationError";
  error: typeToFlattenedError<T, string>["fieldErrors"];
};

export type Response<
  TData,
  FormValues extends Record<string, unknown>
> = Promise<
  ResponseSuccess<TData> | ValidationError<FormValues> | NetworkError
>;

export type AppointmentStatus =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];
