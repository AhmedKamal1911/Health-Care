import { IntroHeading } from "@/components/health-care";
import StatBox from "@/components/health-care/stat-box";

import DoctorTable from "@/components/tables/doctor-table/doctor-table";
import {
  APPOINTMENT_COLLECTION_ID,
  createAdminClient,
  DATABASE_ID,
  DOCTOR_COLLECTION_ID,
} from "@/lib/appwrite";
import { Appointment } from "@/lib/types/appointment";
import { Doctor } from "@/lib/types/doctor";
import { HeartPulse, Hourglass, TriangleAlert } from "lucide-react";

export default async function Doctors() {
  const { databases } = createAdminClient();
  const { documents } = await databases.listDocuments<Doctor>(
    DATABASE_ID,
    DOCTOR_COLLECTION_ID
  );
  const { documents: appointments } =
    await databases.listDocuments<Appointment>(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID
    );

  const doctorsCount = String(documents.length);
  const totalNumbersOfPendingAppointments = String(
    appointments.filter((appointment) => appointment.status === "pending")
      .length
  );
  const totalNumbersOfCancelledAppointments = String(
    appointments.filter((appointment) => appointment.status === "cancelled")
      .length
  );

  return (
    <main className="px-3 sm:px-5 md:px-8 lg:px-14 flex flex-col gap-[42px]">
      <IntroHeading
        title="Welcome, Admin"
        desc="Start day with managing your doctors"
      />
      <div className="flex max-lg:flex-col gap-10 items-stretch lg:items-center">
        <StatBox
          spotLightColor="bg-secondary"
          icon={HeartPulse}
          className="flex-1"
          iconColor="text-secondary"
          iconStyles={{
            filter:
              "drop-shadow(0px 4px 6px -4px #24ae7c) drop-shadow(0px 10px 15px -3px #24ae7c)",
          }}
          statValue={doctorsCount}
          desc="Total number of Doctors in system"
        />
        <StatBox
          spotLightColor="bg-[#79B5EC]"
          icon={Hourglass}
          className="flex-1"
          iconColor="text-[#79B5EC]"
          iconStyles={{
            filter:
              "drop-shadow(0px 4px 6px #79B5EC29) drop-shadow(0px 3px 15px #79B5EC29)",
          }}
          statValue={totalNumbersOfPendingAppointments}
          desc="Total number of pending appointments"
        />
        <StatBox
          spotLightColor="bg-[#F37877]"
          icon={TriangleAlert}
          className="flex-1"
          iconColor="text-[#FF4F4E]"
          iconStyles={{
            filter:
              "drop-shadow(0px 4px 6px #F3787729) drop-shadow(0px 3px 15px #F3787729)",
          }}
          statValue={totalNumbersOfCancelledAppointments}
          desc="Total number of cancelled  appointments"
        />
      </div>
      <DoctorTable documents={documents} />
    </main>
  );
}
