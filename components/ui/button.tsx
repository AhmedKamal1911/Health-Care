import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center  gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none  [&_svg]:shrink-0 ",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-white shadow dark:bg-secondary dark:text-white dark:hover:bg-secondary/80",
        destructive:
          "bg-danger text-white shadow-sm hover:bg-danger/90 dark:bg-danger dark:text-white dark:hover:bg-danger/90",
        outline:
          "border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-white",
        gradient:
          "relative border-none focus:bg-gradient-to-r placeholder:text-neutral focus-visible:ring-[4px] focus-visible:ring-[#84DCF53D] bg-[#363A3D] from-[#82DBF7] to-[#B6F09C] after:absolute after:rounded-md after:inset-[1px] after:bg-[#1A1D21] *:relative *:z-10",
        secondary:
          "bg-purple-500 text-purple-900 shadow-sm hover:bg-purple-100/80 dark:bg-purple-800 dark:text-black dark:hover:bg-purple-800/80",
        ghost:
          "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white",
        link: "text-neutral-900 underline-offset-4 hover:underline dark:text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-[48px] py-2 px-6 text-[16px]",
        xl: "h-[50px]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
