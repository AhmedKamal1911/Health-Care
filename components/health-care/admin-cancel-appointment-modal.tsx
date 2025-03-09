"use client";
import { useState } from "react";

import { Button } from "../ui/button";

import { TriangleAlert } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { CancelAppointmentForm } from "./cancel-appointment-form";

export default function AdminCancelAppointmentModal({
  appointmentId,
  patientId,
}: {
  appointmentId: string;
  patientId: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"destructive"}
          className="flex gap-2 items-center px-2"
        >
          <TriangleAlert className="size-5" />
          <span className="font-bold cursor-pointer">Cancel</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-sm:p-3  bg-[#1A1D21]/[96%] backdrop-blur-sm modal-shadow border-[#FFFFFF14]">
        <DialogHeader className="max-sm:text-start">
          <DialogTitle className=" text-white text-xl lg:text-2xl">
            Cancel Appointment
          </DialogTitle>
          <DialogDescription className="text-tertiary text-[14px]">
            Please Enter the Cancellation Reason to Cancel
          </DialogDescription>
        </DialogHeader>

        <CancelAppointmentForm
          patientId={patientId}
          appointmentId={appointmentId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
