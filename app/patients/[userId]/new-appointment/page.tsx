import { NewAppointmentForm } from "@/components/forms/new-appointment-form";
import { Brand, IntroHeading } from "@/components/health-care";
import {
  createAdminClient,
  DATABASE_ID,
  DOCTOR_COLLECTION_ID,
} from "@/lib/appwrite";
import { getPatient } from "@/lib/queries/patient";
import { Doctor } from "@/lib/types/doctor";

import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";

export default async function NewAppointmentPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const patient = await getPatient(userId);
  const { databases } = createAdminClient();
  const { documents } = await databases.listDocuments<Doctor>(
    DATABASE_ID, // databaseId
    DOCTOR_COLLECTION_ID // collectionId
  );

  if (!patient) return redirect("/", RedirectType.replace);
  // TODO:chech if the user is patient
  return (
    <main className="min-h-screen flex justify-between">
      <div className="text-white flex-1 py-10 ">
        <div className="px-3 md:px-10 xl:pl-[110px] xl:pr-[114px] flex flex-col  h-full">
          <div className="space-y-[72px]">
            <Brand />
            <IntroHeading
              title="Hey there 👋"
              desc="Request a new appointment in 10 seconds"
            />
          </div>
          <div className="mt-[54px]">
            <NewAppointmentForm doctors={documents} patientId={patient.id} />
          </div>
        </div>
      </div>
      <figure className="w-[390px] h-screen sticky end-0 top-0  max-lg:hidden ">
        <Image
          width={1192}
          height={753}
          className="h-full w-full object-cover rounded-tl-[24px] rounded-bl-[24px] "
          draggable={false}
          alt="doctors"
          src={"/assets/images/background2.png"}
        />
      </figure>
    </main>
  );
}
