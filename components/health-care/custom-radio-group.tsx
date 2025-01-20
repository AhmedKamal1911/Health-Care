import { ReactNode } from "react";
import { RadioGroup } from "../ui/radio-group";

type Props = {
  value: string;
  onChange: () => void;
  children: ReactNode;
};
export default function CustomRadioGroup({ onChange, value, children }: Props) {
  return (
    <RadioGroup
      onValueChange={onChange}
      defaultValue={value}
      className="flex items-center max-lg:flex-col"
    >
      {children}
    </RadioGroup>
  );
}
