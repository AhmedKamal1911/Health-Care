"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-react";

import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center justify-center gap-2 has-[:disabled]:opacity-50 ",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    index: number;
    placeholder?: string;
  }
>(({ index, placeholder, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative  rounded-lg p-[1px]",
        {
          "bg-secondary": char && !isActive,
          "z-10  from-[#82DBF7] to-[#B6F09C]  bg-gradient-to-r ring-[4px] ring-[#84DCF53D]":
            isActive,
          "bg-[#363A3D] ": !isActive && !char,
        },
        className
      )}
      {...props}
    >
      <div className="flex bg-primary size-7 min-[375px]:size-10 sm:size-14 md:size-16 lg:size-20 py-[10px] px-2 font-bold text-[17px] min-[375px]:text-xl sm:text-2xl md:text-3xl lg:text-5xl text-center items-center justify-center text-secondary  shadow-sm transition-all rounded-lg dark:border-neutral-800">
        {char ? (
          char
        ) : (
          <>
            {placeholder && !isActive && (
              <span className="text-white">{placeholder}</span>
            )}
          </>
        )}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-3 sm:h-9 w-[2px] animate-caret-blink bg-secondary duration-1000 dark:bg-neutral-50" />
          </div>
        )}
      </div>
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
