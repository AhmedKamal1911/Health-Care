import Image from "next/image";
import StatBox from "./stat-box";
import { Calendar, Hourglass, TriangleAlert } from "lucide-react";
import { Models } from "node-appwrite";

type Props = {
  accountInfo: Models.User<Models.Preferences> | null;
};
export default function UserInfoCard({ accountInfo }: Props) {
  console.log("test", accountInfo);
  return (
    <div className="rounded-xl bg-primaryGray p-5 lg:p-10 flex flex-col gap-10 shadow-[2px_2px_6px_black]">
      <div className="relative after:absolute after:-start-5 after:bottom-1/2 after:translate-y-1/2 after:h-[35px] after:rounded-lg after:w-[10px] after:bg-secondary ms-5">
        <span className="font-bold text-2xl">User Details</span>
      </div>
      <div className="flex max-lg:flex-col max-lg:items-start items-center gap-8">
        <figure>
          <Image
            src={"/assets/images/background2.png"}
            height={100}
            width={100}
            alt="user profile image"
            className="rounded-full max-lg:rounded-md max-lg:border size-[120px] object-cover"
          />
        </figure>
        <div>
          <span className="font-bold text-xl">{accountInfo?.name}</span>
          <div className="flex max-lg:flex-col max-lg:items-start items-center gap-8 mt-5">
            <div className="flex flex-col gap-2">
              <span className="text-tertiary ">Role</span>
              <span className="font-semibold text-[12px] min-[310px]:text-[16px] md:text-[18px]">
                Health Care {accountInfo?.labels[0]}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-tertiary ">Phone Number</span>
              <span className="font-semibold text-[12px] min-[310px]:text-[16px] md:text-[18px]">
                {`(${accountInfo?.phone.slice(
                  0,
                  3
                )}) ${accountInfo?.phone.slice(3)}`}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-tertiary ">Email Address</span>
              <span className="font-semibold text-[12px] min-[310px]:text-[16px] md:text-[18px]">
                {accountInfo?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Stats cards */}
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
          statValue={"309"}
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
          statValue={"105"}
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
          statValue={"66"}
          desc="Total number of cancelled  appointments"
        />
      </div>
    </div>
  );
}
