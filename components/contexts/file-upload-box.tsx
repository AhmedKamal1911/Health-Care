"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import UploadBox from "../health-care/upload-box";

const FileUploadContext = createContext<ContextValue | null>(null);
type Props = {
  children: ReactNode;
};

type OpenFileParams = { file: File };
type ContextValue = {
  setProgress: Dispatch<SetStateAction<number>>;
  setUploadError: Dispatch<SetStateAction<boolean>>;
  open: ({ file }: OpenFileParams) => void;
};

export default function FileUploadBoxProvider({ children }: Props) {
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isError, setUploadError] = useState(false);
  function open({ file }: OpenFileParams) {
    setIsOpen(true);
    setFile(file);
  }
  const contextValue = useMemo(
    () => ({ setProgress, open, setUploadError }),
    []
  );
  return (
    <FileUploadContext.Provider value={contextValue}>
      {children}

      {file && (
        <UploadBox
          progress={progress}
          open={isOpen}
          file={file}
          onClose={() => setIsOpen(false)}
          removeFile={() => setFile(null)}
          isError={isError}
        />
      )}
    </FileUploadContext.Provider>
  );
}

export const useFileUploadBox = () => {
  const contextValue = useContext(FileUploadContext);
  if (!contextValue) {
    throw new Error(
      "You cannot use useFileUploadBox outside it's provider 'FileUploadProvider'"
    );
  }
  return contextValue;
};
