import { CloudUpload } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Badge } from "../ui/badge";

type Props = {
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  multiple?: boolean;
  accept?: string;
  setValue: (files: File[]) => void;
};
export default function CustomDropzone({
  onBlur,
  multiple = false,
  setValue,
  accept,
}: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle accepted files

    setValue(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    onDrop,
  });
  return (
    <div
      className={`${
        isDragActive && "bg-[#363A3D]"
      } relative min-h-[134px] flex justify-center items-center cursor-pointer py-5 px-6 border border-1 border-dashed rounded-lg border-[#363A3D]`}
      {...getRootProps({ onBlur })}
    >
      <input {...getInputProps({ accept })} />

      <div className="flex justify-center items-center text-center">
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Badge
              variant="secondary"
              className="bg-[#2D3136] rounded-full h-10 w-10 justify-center items-center mb-3"
            >
              <CloudUpload className="text-secondary flex-1" />
            </Badge>
            <div className="space-y-1 flex flex-col justify-center items-center">
              <p className="text-tertiary text-[14px]">
                <span className="text-secondary font-semibold">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <span className="text-tertiary text-[12px]">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
