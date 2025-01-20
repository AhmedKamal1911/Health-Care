import { cn } from "@/lib/utils";
import { Textarea, TextareaProps } from "../ui/textarea";

export default function CustomTextarea({ className, ...props }: TextareaProps) {
  return (
    <div className="relative bg-[#363A3D] from-[#82DBF7] to-[#B6F09C] p-[1px] rounded-md focus-within:bg-gradient-to-r">
      <Textarea
        className={cn(
          "resize-none bg-[#1A1D21]  py-3 pe-4 h-[96px] border-none placeholder:text-neutral  focus-visible:ring-[4px] focus-visible:ring-[#84DCF53D] ",
          className
        )}
        {...props}
      />
    </div>
  );
}
