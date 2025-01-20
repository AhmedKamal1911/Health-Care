import { FormLabel } from "../ui/form";

import { CustomInput, CustomInputProps } from "./custom-input";

type CustomFormFieldProps = {
  label?: string;
} & CustomInputProps;
export function CustomFormField({ label, id, ...props }: CustomFormFieldProps) {
  return (
    <div>
      {label && (
        <FormLabel className="mb-[16px] block text-tertiary w-fit" htmlFor={id}>
          {label}
        </FormLabel>
      )}

      <CustomInput id={id} {...props} />
    </div>
  );
}
