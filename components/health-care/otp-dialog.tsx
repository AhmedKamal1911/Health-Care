"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import VerificationOTP from "./verification-otp";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useActionState, useState } from "react";
import { completeOTPChallenge } from "@/lib/actions/authActions";

type OTPDialogProps = {
  triggerTitle?: string;
  submitBtnTitle: string;
  title: string;
  desc: string;
  open: boolean;
  challengeId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
export function OTPDialog({
  triggerTitle,
  submitBtnTitle,
  title,
  desc,
  open,
  challengeId,
  setOpen,
}: OTPDialogProps) {
  const [state, action, isPending] = useActionState(
    completeOTPChallenge,
    undefined
  );
  const [OTPValue, setOTPValue] = useState("");
  console.log({ OTPValue, state, challengeId });
  const completeOTPChallengeAction = action.bind(undefined, {
    challengeId,
    OTP: OTPValue,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerTitle && (
        <DialogTrigger asChild>
          <button className="text-neutral hover:text-secondary transition-colors">
            {triggerTitle}
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="px-5 lg:px-10 pt-5 lg:pt-10 pb-[25px] lg:pb-[50px] bg-[#1A1D21]/[96%] backdrop-blur-sm modal-shadow border border-[#FFFFFF14]  w-[670px] max-w-[85%] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl lg:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-tertiary text-[14px] lg:text-[16px]">
            {desc}
          </DialogDescription>
          {state?.status === "failed" && !isPending && (
            <span className="text-red-600">
              Failed to Verify OTP Please try again!
            </span>
          )}
        </DialogHeader>
        <form action={completeOTPChallengeAction}>
          <div className="my-[40px]">
            <VerificationOTP onOTPComplete={setOTPValue} />
          </div>
          <Button
            disabled={isPending || !OTPValue || state?.status === "success"}
            className="w-full  text-[16px] text-white p-4 sm:p-6"
            type="submit"
          >
            {isPending ? "Verifying" : submitBtnTitle}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
