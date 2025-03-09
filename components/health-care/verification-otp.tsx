"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
type Props = {
  length?: number;
  setIsCompleted: (value: boolean) => void;
};
export default function VerificationOTP({ length = 6, setIsCompleted }: Props) {
  return (
    <InputOTP
      name="OTP"
      maxLength={length}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      onInput={(e) => {
        console.log(e.currentTarget.value);
        setIsCompleted(e.currentTarget.value.length === length);
      }}
    >
      <InputOTPGroup className="gap-1 sm:gap-4 md:gap-8 lg:gap-[18px]">
        {Array.from({ length }).map((_, i) => (
          <InputOTPSlot key={i} placeholder="0" index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
