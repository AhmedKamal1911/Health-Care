import getAccount from "@/lib/queries/account";
import { Brand } from "./brand";
import ProfileMenu from "./profileMenu";

export default async function Header() {
  const accountData = await getAccount();
  console.log({ accountData });
  return (
    <header className="py-6 px-12 bg-darkPrimary rounded-[20px] flex justify-between">
      <Brand />
      <div>
        {accountData && (
          <ProfileMenu
            email={accountData.email}
            accountName={accountData.name}
          />
        )}
      </div>
    </header>
  );
}
