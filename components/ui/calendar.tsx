"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 bg-[#1A1D21] border-[2px] rounded-md border-[#363A3D]",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium font-bold",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-black rounded-sm p-0 hover:opacity-90"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-[0.8rem] font-normal rounded-md w-8 text-purple-500 dark:text-white",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center  text-sm focus-within:relative focus-within:z-20 rounded-sm",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-sm[&:has(>.day-range-start)]:rounded-l-sm first:[&:has([aria-selected])]:rounded-l-sm last:[&:has([aria-selected])]:rounded-r-sm"
            : "[&:has([aria-selected])]:rounded-sm",
          "[&:has([aria-selected])]:bg-[#24AE7C] [&:has([aria-selected].day-outside)]:bg-[#24AE7C]/50 dark:[&:has([aria-selected])]:bg-[#ABB8C4] dark:[&:has([aria-selected].day-outside)]:bg-[#ABB8C4]/50"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100  text-white rounded-sm "
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-white hover:bg-secondary/80 focus:bg-secondary active:bg-secondary dark:bg-secondary dark:text-white dark:hover:bg-secondary/80 dark:focus:bg-secondary dark:active:bg-secondary",
        day_today:
          "bg-[#76828D] text-white dark:bg-orange-500 dark:text-white ",
        day_outside:
          "text-primary  aria-selected:bg-primary aria-selected:text-primary dark:text-black dark:aria-selected:bg-primary/50 dark:aria-selected:bg-secondary dark:text-white",
        day_disabled: "text-black opacity-50 dark:text-purple",
        day_range_middle:
          "aria-selected:bg-[#24AE7C] aria-selected:text-white dark:aria-selected:bg-[#ABB8C4] dark:aria-selected:text-primary",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
