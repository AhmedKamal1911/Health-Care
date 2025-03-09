import { ReactNode } from "react";
import { AppointmentStatus } from "./types/types";
import { BookmarkX, Check, Hourglass } from "lucide-react";

export const GENDER_LIST = ["male", "female", "other"] as const;
export const consents = [
  {
    id: "health condition",
    label: "I consent to receive treatment for my health condition.",
  },
  {
    id: "treatment purposes",
    label:
      "I consent to the use and disclosure of my health information for treatment purposes.",
  },
  {
    id: "privacy policy",
    label: "I acknowledge that I have reviewed and agree to the privacy policy",
  },
];

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Poklicy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const documentErrorMessages: { [status: number]: string } = {
  400: "Invalid input. Please ensure all required fields are filled correctly.",
  401: "Unauthorized. Please log in and try again.",
  403: "Access denied. You do not have the necessary permissions.",
  404: "Collection not found. Please check the collection ID.",
  409: "A User with the same email or phone number already exists.",
  500: "Server error. Please try again later.",
};

export const APPOINTMENT_STATUS = {
  CANCELED: "cancelled",
  PENDING: "pending",
  SCHEDULED: "scheduled",
} as const;
export const APPOINTMENT_STATUS_TUPLE = [
  APPOINTMENT_STATUS.CANCELED,
  APPOINTMENT_STATUS.PENDING,
  APPOINTMENT_STATUS.SCHEDULED,
] as const;
export const appointmentStatus: Record<AppointmentStatus, ReactNode> = {
  pending: <Hourglass className="size-5" />,
  scheduled: <Check className="size-5" />,
  cancelled: <BookmarkX className="size-5" />,
};
