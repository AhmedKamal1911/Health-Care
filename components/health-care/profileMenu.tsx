import { LifeBuoy, Settings, User } from "lucide-react";

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

type Props = {
  accountName: string;
};

export default function ProfileMenu({ accountName }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-white flex items-center gap-2">
          <CustomAvatar
            fallback={
              <span className="capitalize">
                {generateTextFallback(accountName)}
              </span>
            }
            alt="user profile image"
          />
          {accountName}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-darkPrimary">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            <span>Profile</span>
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
