import { cn } from "@/lib/utils";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input/input";
import { ComponentProps } from "react";
type Props = ComponentProps<typeof PhoneInput>;
export function CustomPhoneInput({ className, ...props }: Props) {
  return <PhoneInput className={cn("text-black", className)} {...props} />;
}
