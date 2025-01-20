import Image from "next/image";
import { Input, InputProps } from "../ui/input";
import { cn } from "@/lib/utils";

export type CustomInputProps = {
  icon?: string;
  iconAlt?: string;
} & InputProps;

export function CustomInput({
  icon,
  iconAlt = "Icon",
  className,
  ...props
}: CustomInputProps) {
  return (
    <div className="relative bg-[#363A3D] from-[#82DBF7] to-[#B6F09C] p-[1px] rounded-md focus: focus-within:bg-gradient-to-r">
      {icon && (
        <Image
          className="absolute start-4 top-3"
          priority
          width={24}
          height={24}
          src={icon}
          alt={iconAlt}
        />
      )}
      <Input
        className={cn(
          "bg-[#1A1D21]  py-3 pe-4 h-[48px] border-none placeholder:text-neutral  focus-visible:ring-[4px] focus-visible:ring-[#84DCF53D] ",
          {
            "ps-[52px]": Boolean(icon),
          },
          className
        )}
        {...props}
      />
    </div>
  );
}
