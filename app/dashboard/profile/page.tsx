import UserInfoCard from "@/components/health-care/user-info-card";
import getAccount from "@/lib/queries/account";

type Props = {};
export default async function ProfilePage({}: Props) {
  const accountData = await getAccount();
  // TODO: add stats boxes data
  return (
    <div className="px-3 sm:px-5 md:px-8 lg:px-14">
      <UserInfoCard accountInfo={accountData} />
    </div>
  );
}
