import LoginForm from "@/components/forms/login-form";

import {
  Brand,
  Copyright,
  IntroHeading,
  OTPDialog,
} from "@/components/health-care";
import { createAdminClient } from "@/lib/appwrite";

import Image from "next/image";
export default async function Login() {
  return (
    <main className="h-screen max-h-screen flex justify-between">
      <div className="text-white flex-1 py-[60px] ">
        <div className="px-3 md:px-10 xl:pl-[110px] xl:pr-[114px] flex flex-col justify-between h-full">
          <Brand />
          <div>
            <IntroHeading
              title="Hi there, ..."
              desc="Get Started with Appointments."
            />
            <div className="mt-[54px]">
              <LoginForm />
            </div>
          </div>
          <div className="flex justify-between">
            <Copyright />
          </div>
        </div>
      </div>
      <figure className=" flex-1 max-lg:hidden ">
        <Image
          width={1192}
          height={753}
          className="h-full w-full object-cover rounded-tl-[24px] rounded-bl-[24px] "
          draggable={false}
          alt="doctors"
          src={"/assets/images/doctors.png"}
        />
      </figure>
    </main>
  );
}
