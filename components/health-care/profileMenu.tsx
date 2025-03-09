import { ChevronDown, LifeBuoy, Settings, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CustomAvatar from "./custom-avatar";
import { generateTextFallback } from "@/lib/utils";
import { LogoutButton } from "./logout-button";
import Link from "next/link";

type Props = {
  accountName: string;
  email: string;
};

export default function ProfileMenu({ accountName, email }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-white flex items-center gap-4">
          <CustomAvatar
            className="size-12"
            fallback={
              <span className="capitalize">
                {generateTextFallback(accountName)}
              </span>
            }
            alt="user profile image"
          />
          <div className="flex flex-col items-start">
            <span className="font-bold capitalize">{accountName}</span>
            <span className="text-gray-400"> {email}</span>
          </div>
          <ChevronDown />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 bg-darkPrimary">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            <Link href={"/dashboard/profile"}>Profile</Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <LifeBuoy />
          <span>Support</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
