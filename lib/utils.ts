import { clsx, type ClassValue } from "clsx";
import { AppwriteException, Models } from "node-appwrite";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateImageDimensions(
  imageFile: File,
  validate: ({ width, height }: { width: number; height: number }) => boolean
) {
  return new Promise<boolean>((reslove) => {
    // Client dimensions validation
    const imageUrl = URL.createObjectURL(imageFile);
    const image = new Image();

    image.onload = () => {
      // validate diamentions
      reslove(validate({ width: image.width, height: image.height }));
      // Clear URL FROM MEMO (performance optimize)
      URL.revokeObjectURL(imageUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
    };
    image.src = imageUrl;
  });
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const uploadFileWithProgress = <
  T extends { [key: string]: Models.File }
>(
  url: string,
  file: File,
  onProgress: (progress: UploadProgress) => void
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("identificationDocument", file);
    xhr.open("POST", url, true);
    // Track progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress: UploadProgress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        };
        onProgress(progress);
      }
    };

    // Handle success
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject(JSON.parse(xhr.response));
      }
    };

    // Send the request
    xhr.send(formData);
  });
};

export function handleErrorMessage(error: unknown) {
  const defaultStatus = 500;
  const defaultMessage = "Something went wrong!";
  const statusText = "Internal Server Error";
  if (error instanceof AppwriteException) {
    return {
      status: error.code,
      message: error.message,
      statusText: error.type,
    };
  } else if (error instanceof Error) {
    return { message: error.message, status: defaultStatus, statusText };
  } else {
    return { status: defaultStatus, message: defaultMessage, statusText };
  }
}

export function generateTextFallback(name: string) {
  const textFallback = name.split(" ");
  if (textFallback.length > 1) {
    return `${textFallback[0][0]}${textFallback[1][0]}`;
  } else {
    return `${textFallback[0][0]}${textFallback[0][1]}`;
  }
}

export function getFileUrl(imageId: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/api/files/${imageId}`;
}
