import { ReactNode } from "react";
import { FormControl } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  value: string;
  onChange: () => void;
  children: ReactNode;
  placeholder?: string;
  withFormControl?: boolean;
};
export default function CustomSelect({
  onChange,
  value,
  children,
  placeholder = "select any value",
  withFormControl = false,
}: Props) {
  const trigger = (
    <SelectTrigger className="px-4 h-12 relative border-none focus:bg-gradient-to-r placeholder:text-neutral focus-visible:ring-[4px] focus-visible:ring-[#84DCF53D] bg-[#363A3D] from-[#82DBF7] to-[#B6F09C] after:absolute after:rounded-md after:inset-[1px] after:bg-[#1A1D21] *:relative *:z-10">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
  );
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      {withFormControl ? <FormControl>{trigger}</FormControl> : trigger}

      <SelectContent className="bg-primary border-2 border-[#1A1D21]">
        {children}
      </SelectContent>
    </Select>
  );
}
