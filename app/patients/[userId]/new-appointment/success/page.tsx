import { Brand } from "@/components/health-care";
import CounterRedirect from "@/components/health-care/counter-redirect";
import DoctorBadge from "@/components/health-care/doctor-badge";
import getAppointment from "@/lib/queries/appointment";
import { format } from "date-fns";
import { Calendar, CircleCheck } from "lucide-react";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await searchParams;

  const { doctor, appointmentDate } = await getAppointment(appointmentId);

  return (
    <main className="p-7 sm:p-[60px] h-screen">
      <div className="flex justify-center mb-40">
        <Brand />
      </div>
      <div className="flex flex-col items-center text-center mb-11">
        <CircleCheck className="size-[100px] text-[#4AC97E]  success-icon-shadow" />
        <p className="font-bold text-3xl md:text-4xl mt-[10px] mb-6 max-w-[612px]">
          Your <span className="text-[#4AC97E]">appointment request</span> has
          been successfully submitted!
        </p>
        <span className="font-medium text-tertiary">
          We&apos;ll be in touch shortly to confirm.
        </span>
      </div>
      <div className="flex max-lg:flex-col text-center justify-center items-center gap-[30px]">
        <span className="font-medium text-tertiary text-2xl">
          Requested appointment details:
        </span>
        {doctor && (
          <DoctorBadge
            doctorName={doctor.doctorName}
            // src={doctor.avatarImage}
          />
        )}

        <div className="flex items-center gap-2">
          <Calendar className="size-4" />
          <span className="text-tertiary">
            {format(appointmentDate, "d MMMM yyyy - h:mm a")}
          </span>
        </div>
      </div>
      <CounterRedirect path="/login" />
    </main>
  );
}
