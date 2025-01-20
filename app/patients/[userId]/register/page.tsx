import PatientRegisterForm from "@/components/forms/patient-register-form";
import { Brand, Copyright, IntroHeading } from "@/components/health-care";
// import { accounts, ID, users } from "@/lib/appwrite";

import { getPatient } from "@/lib/queries/patient";
import { getUser } from "@/lib/queries/user";
import { Metadata } from "next";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";

type Props = {
  params: Promise<{
    userId: string;
  }>;
};
export const metadata: Metadata = {
  title: "Register",
  description: "This page is used for registration for patient",
};

// Static
export default async function RegisterPatientPage({ params }: Props) {
  const { userId: id } = await params;
  const user = await getUser(id);
  const patient = await getPatient(id);

  if (!user) return redirect("/", RedirectType.replace);

  if (patient)
    return redirect(
      `/patients/${user.id}/new-appointment`,
      RedirectType.replace
    );
  return (
    <main className="min-h-screen flex justify-between">
      <div className="text-white flex-1 py-10 ">
        <div className="px-3 md:px-10 xl:pl-[110px] xl:pr-[114px] flex flex-col justify-between h-full">
          <div className="space-y-[72px]">
            <Brand />
            <IntroHeading
              title="Welcome 👋"
              desc="Let us know more about yourself"
            />
          </div>
          <div className="mt-[54px]">
            <PatientRegisterForm user={user} />
          </div>
          <div className="flex justify-between my-12">
            <Copyright />
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
          src={"/assets/images/background1.png"}
        />
      </figure>
    </main>
  );
}
