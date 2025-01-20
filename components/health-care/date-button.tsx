import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Button, ButtonProps } from "../ui/button";

type DateButtonProps<T> = {
  dateValue: T | null;
  formattedValue: string;
  placeholder?: string;
} & ButtonProps;

export default function DateButton<T>({
  dateValue,
  formattedValue,
  placeholder = "Select a date",
  ...btnProps
}: DateButtonProps<T>) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "relative flex justify-start w-full h-[50px] border-none focus:bg-gradient-to-r placeholder:text-neutral focus-visible:ring-[4px] focus-visible:ring-[#84DCF53D] bg-[#363A3D] from-[#82DBF7] to-[#B6F09C] after:absolute after:rounded-md after:inset-[1px] after:bg-[#1A1D21] *:relative *:z-10",
        !dateValue && "text-tertiary"
      )}
      {...btnProps}
    >
      <CalendarIcon className="!w-[20px] !h-[25px]" />
      <span>{dateValue ? formattedValue : placeholder}</span>
    </Button>
  );
}
