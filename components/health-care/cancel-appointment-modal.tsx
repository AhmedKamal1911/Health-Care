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
import { cancelPatientAppointment } from "@/lib/actions/patientActions";
import { AppointmentStatus } from "@/lib/types/types";

type Props = {
  appointmentId: string;
  appointmentStatus: AppointmentStatus;
};
export default function CancelAppointmentModal({
  appointmentId,
  appointmentStatus,
}: Props) {
  const [state, action, isPending] = useActionState(
    cancelPatientAppointment,
    undefined
  );
  const [open, setOpen] = useState(false);
  const deleteAppointmentAction = action.bind(undefined, appointmentId);

  useEffect(() => {
    if (state?.success === true) {
      setOpen(false);
    }
  }, [state?.success]);
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            disabled={appointmentStatus === "cancelled"}
            variant="destructive"
            className="capitalize p-2 size-fit"
          >
            cancel
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form action={deleteAppointmentAction}>
            {state?.success === false && (
              <span className="text-sm text-red-600">
                {state.error.message}
              </span>
            )}
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
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
