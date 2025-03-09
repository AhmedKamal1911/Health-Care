"use client";
import { useActionState, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

import { adminDeleteAppointment } from "@/lib/actions/appointmentActions";
import { Trash } from "lucide-react";

type Props = {
  appointmentId: string;
};

export default function AdminDeleteAppointment({ appointmentId }: Props) {
  const [state, action, isPending] = useActionState(
    adminDeleteAppointment,
    undefined
  );
  const [open, setOpen] = useState(false);
  const deleteAppointmentAction = action.bind(undefined, appointmentId);

  useEffect(() => {
    if (state?.status === "success") {
      setOpen(false);
    }
  }, [state?.status]);
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant={"destructive"}
            className="flex gap-2 items-center px-2"
          >
            <Trash className="size-5" />
            <span className="font-bold cursor-pointer">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form action={deleteAppointmentAction}>
            {state?.status === "NetworkError" && (
              <span className="text-sm text-red-600">
                {state.error.message}
              </span>
            )}
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                Appointment
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-3">
              <AlertDialogCancel disabled={isPending} className="w-full">
                Cancel
              </AlertDialogCancel>

              <Button disabled={isPending} className="w-full" type="submit">
                {isPending ? "Loading..." : "Confirm"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
