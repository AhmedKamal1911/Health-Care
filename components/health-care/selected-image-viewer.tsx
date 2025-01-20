import Image from "next/image";
import { Button } from "../ui/button";
import { X } from "lucide-react";

type SelectedImageViewer = {
  url: string;
  onClose: () => void;
};
export const SelectedImageViewer = ({ url, onClose }: SelectedImageViewer) => {
  return !url ? null : (
    <div className="relative">
      <Button
        onClick={onClose}
        className="absolute h-10 w-10 end-1 top-1 rounded-full"
        variant={"destructive"}
      >
        <X />
      </Button>
      <Image
        src={url}
        height={200}
        width={200}
        alt="selected image"
        className="w-full h-[400px] object-cover rounded-md"
      />
    </div>
  );
};
