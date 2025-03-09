import { IntroHeading } from "@/components/health-care";

import StatBox from "@/components/health-care/stat-box";
import AdminTable from "@/components/tables/admin-table/admin-table";
import {
  APPOINTMENT_COLLECTION_ID,
  createAdminClient,
  DATABASE_ID,
} from "@/lib/appwrite";
import { Appointment } from "@/lib/types/appointment";
import { Calendar, Hourglass, TriangleAlert } from "lucide-react";

export default async function AdminPage() {
  const { databases } = createAdminClient();
  const { documents } = await databases.listDocuments<Appointment>(
    DATABASE_ID,
    APPOINTMENT_COLLECTION_ID
  );
  const pendingAppointmentsLength = String(
    documents.filter((doc) => doc.status === "pending").length
  );
  const scheduledAppointmentsLength = String(
    documents.filter((doc) => doc.status === "scheduled").length
  );
  const cancelledAppointmentsLength = String(
    documents.filter((doc) => doc.status === "cancelled").length
  );

  return (
    <main className="px-3 sm:px-5 md:px-8 lg:px-14 flex flex-col gap-[42px]">
      <IntroHeading
        title="Welcome, Admin"
        desc="Start day with managing new appointments"
      />
      <div className="flex max-lg:flex-col gap-10 items-stretch lg:items-center">
        <StatBox
          spotLightColor="bg-[#FFD147]"
          icon={Calendar}
          className="flex-1"
          iconColor="text-[#FFD147]"
          iconStyles={{
            filter:
              "drop-shadow(0px 4px 6px -4px #FFD14729) drop-shadow(0px 10px 15px -3px #FFD14729)",
          }}
          statValue={scheduledAppointmentsLength}
          desc="Total number of scheduled appointments"
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
          statValue={pendingAppointmentsLength}
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
          statValue={cancelledAppointmentsLength}
          desc="Total number of cancelled  appointments"
        />
      </div>
      <AdminTable documents={documents} />
    </main>
  );
}
