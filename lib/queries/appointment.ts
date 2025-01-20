import { redirect, RedirectType } from "next/navigation";
import { Appointment, appointmentDTOSchema } from "../types/appointment";

export default async function getAppointment(appointmentId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/appointments/${appointmentId}`
    );

    if (!response.ok && response.status === 404)
      return redirect("/", RedirectType.replace);
    const appointment: Appointment = await response.json();

    const result = appointmentDTOSchema.safeParse({
      ...appointment,
      status: appointment.status || "pending",
    });
    if (!result.success) {
      console.error(result.error.issues);

      throw new Error("Unexpected error happend...");
    }
    return result.data;
  } catch (error) {
    throw error;
  }
}
