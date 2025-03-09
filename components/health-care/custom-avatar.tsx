import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

type CustomAvatarProps = {
  src?: string;
  alt: string;
  fallback: ReactNode;
  className?: string;
};
export default function CustomAvatar({
  alt,
  fallback,
  className,
  src,
}: CustomAvatarProps) {
  return (
    <Avatar className={cn("w-8 h-8", className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-gray-600">{fallback}</AvatarFallback>
    </Avatar>
  );
}
