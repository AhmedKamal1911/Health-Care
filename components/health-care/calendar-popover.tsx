import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar, CalendarProps } from "../ui/calendar";
import { ReactNode } from "react";

type Props = {
  trigger: ReactNode;
  modal?: boolean;
  calendarProps: CalendarProps;
};
export default function CalendarPopover({
  trigger,
  modal = true,
  calendarProps,
}: Props) {
  return (
    <Popover modal={modal}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none" align="start">
        <Calendar {...calendarProps} />
      </PopoverContent>
    </Popover>
  );
}
