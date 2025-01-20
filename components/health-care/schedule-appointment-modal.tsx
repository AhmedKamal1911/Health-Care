import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { PatientAppointmentForm } from "./patient-appointment-form";
import { useState } from "react";
import { Doctor } from "@/lib/types/doctor";

type Props = {
  doctors: Doctor[];
};
export default function ScheduleAppointmentModal({ doctors }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center">
          <Plus className="size-5" />
          <span className="font-bold cursor-pointer">Schudle Appointment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-sm:p-3  bg-[#1A1D21]/[96%] backdrop-blur-sm modal-shadow border-[#FFFFFF14]">
        <DialogHeader className="max-sm:text-start">
          <DialogTitle className=" text-white text-xl lg:text-2xl">
            Schedule Appointment
          </DialogTitle>
          <DialogDescription className="text-tertiary text-[14px] lg:text-[16px]">
            Please fill in the following details to schedule
          </DialogDescription>
        </DialogHeader>

        <PatientAppointmentForm
          doctors={doctors}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
