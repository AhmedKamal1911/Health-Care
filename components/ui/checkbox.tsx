"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
export type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      " peer p-[1px]   data-[state=checked]:focus-visible:bg-green-500 data-[state=unchecked]:focus-visible:bg-gradient-to-tr from-[#4D62E5] via-[#87DDEE] to-[#B6F09C]  w-6 h-6 shrink-0 rounded-[4px]  shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-neutral-900 data-[state=checked]:text-neutral-50 dark:border-neutral-800 dark:border-neutral-50 dark:focus-visible:ring-[#84DCF53D] dark:data-[state=checked]:bg-neutral-50 dark:data-[state=checked]:text-neutral-900",
      className
    )}
    {...props}
  >
    <div className="bg-[#1A1D21] h-full w-full has-[[data-state=checked]]:border-none border border-[#363A3D] rounded-[4px]">
      <CheckboxPrimitive.Indicator
        className={cn(
          " flex items-center rounded-[4px] justify-center text-current bg-gradient-to-tr from-[#4D62E5] via-[#87DDEE] to-[#B6F09C] h-full "
        )}
      >
        <Check className="h-4 w-4 text-black" />
      </CheckboxPrimitive.Indicator>
    </div>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
