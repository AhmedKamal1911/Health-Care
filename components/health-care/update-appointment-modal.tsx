import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { useState } from "react";
import { UpdateAppointmentForm } from "./update-appointment-form";
import { Appointment } from "@/lib/types/appointment";
import { Doctor } from "@/lib/types/doctor";

export default function UpdateAppointmentModal({
  appointment,
  doctors,
}: {
  appointment: Appointment;
  doctors: Doctor[];
}) {
  const [open, setOpen] = useState(false);

  console.log({ appointment, doctors });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center px-2">
          <Edit className="size-5" />
          <span className="font-bold cursor-pointer">Update</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-sm:p-3  bg-[#1A1D21]/[96%] backdrop-blur-sm modal-shadow border-[#FFFFFF14]">
        <DialogHeader className="max-sm:text-start">
          <DialogTitle className=" text-white text-xl lg:text-2xl">
            Update Appointment
          </DialogTitle>
          <DialogDescription className="text-tertiary text-[14px] lg:text-[16px]">
            Please Change the following details to Update
          </DialogDescription>
        </DialogHeader>

        <UpdateAppointmentForm
          doctors={doctors}
          appointment={appointment}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
