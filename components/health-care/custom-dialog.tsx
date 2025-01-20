import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
type OTPDialogProps = {
  triggerButton: ReactNode;
  content: ReactNode;
  title: string;
  desc: string;
};
export function CustomDialog({
  triggerButton,
  content,
  title,
  desc,
}: OTPDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="px-5 lg:px-10 pt-5 lg:pt-10 pb-[25px] lg:pb-[50px] bg-[#1A1D21]/[96%] border border-[#FFFFFF14] backdrop-blur-sm modal-shadow w-[640px] max-w-[85%] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl lg:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-tertiary text-[14px] lg:text-[16px]">
            {desc}
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
