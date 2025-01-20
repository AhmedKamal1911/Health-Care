"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
type Props = {
  length?: number;
  onOTPComplete: (value: string) => void;
};
export default function VerificationOTP({ length = 6, onOTPComplete }: Props) {
  return (
    <InputOTP
      maxLength={length}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      onComplete={onOTPComplete}
    >
      <InputOTPGroup className="gap-1 sm:gap-4 md:gap-8 lg:gap-[18px]">
        {Array.from({ length }).map((_, i) => (
          <InputOTPSlot key={i} placeholder="0" index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
