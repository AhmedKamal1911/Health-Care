import clsx from "clsx";
import { Check, File, LoaderCircle, X } from "lucide-react";
import { useEffect, useCallback } from "react";

type Props = {
  progress: number;
  file: File;
  open: boolean;
  isError: boolean;
  onClose: () => void;
  removeFile: () => void;
};
export default function UploadBox({
  progress,
  file,
  onClose: onCloseProp,
  removeFile,
  open,
  isError,
}: Props) {
  const onClose = useCallback(() => {
    onCloseProp();
  }, [onCloseProp]);

  useEffect(() => {
    if (!open) return;
    const timeoutId = setTimeout(() => {
      onClose();
      console.log("closed");
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose, open]);

  return (
    <div
      onAnimationEnd={(e) => {
        if (
          (e.target as HTMLElement).classList.contains(
            "animate-smooth-slide-out"
          )
        ) {
          removeFile();
        }
      }}
      className={`${
        open ? "animate-smooth-slide-in" : "animate-smooth-slide-out"
      } bg-[#1B1C1F] border-[1px] border-gray-500 rounded-sm overflow-hidden  w-[95%] min-[375px]:max-w-[350px] end-2  fixed  bottom-2`}
    >
      <div className="bg-primary text-white p-2 flex items-center justify-between ">
        <span>Uploading File</span>
        <button onClick={onClose} className="p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <FileCard file={file} progress={progress} isError={isError} />
    </div>
  );
}

function FileCard({
  file,
  progress,
  isError,
}: {
  file: File;
  progress: number;
  isError: boolean;
}) {
  const isCompleted = progress === 100;
  return (
    <div className="flex justify-between p-2">
      <div className="flex gap-3 items-center">
        <File className="w-6 h-6" />
        <span className="text-tertiary">{file.name}</span>
      </div>

      <div className="flex items-center gap-1">
        {isError ? (
          <X className="text-red-500 w-5 h-5" />
        ) : isCompleted ? (
          <Check className="text-secondary" />
        ) : (
          <div className="animate-spin w-fit">
            <LoaderCircle />
          </div>
        )}

        <span
          className={clsx({
            "text-tertiary": progress < 50,
            "text-yellow-400": progress >= 50 && progress < 90,
            "text-secondary": progress >= 90,
            "text-red-500": isError,
          })}
        >
          {isError ? "Failed" : isCompleted ? "Completed" : `${progress} %`}
        </span>
      </div>
    </div>
  );
}
