import { AppointmentStatus } from "@/lib/types/types";
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
import { scheduleAppointment } from "@/lib/actions/appointmentActions";

type Props = {
  appointmentId: string;
  appointmentStatus: AppointmentStatus;
};
export default function ConfirmAppointmentModal({
  appointmentId,
  appointmentStatus,
}: Props) {
  const [state, action, isPending] = useActionState(
    scheduleAppointment,
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
            disabled={appointmentStatus === "scheduled"}
            variant="default"
            className="capitalize p-2 size-fit"
          >
            Schedule
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
                This action cannot be undone. This will permanently Schedule the
                appointment.
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
