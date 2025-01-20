"use client";

import { userLogout } from "@/lib/actions/authActions";
import { LogOut } from "lucide-react";
import { useActionState } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function LogoutButton() {
  const [, action, isPending] = useActionState(userLogout, undefined);

  return (
    <form action={action}>
      <DropdownMenuItem className="hover:bg-red-600 w-full  font-bold" asChild>
        <button disabled={isPending}>
          <LogOut className="size-4 " />
          <span>{isPending ? "Pending..." : "Log out"}</span>
        </button>
      </DropdownMenuItem>
    </form>
  );
}
