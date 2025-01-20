import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type CustomAvatarProps = {
  src?: string;
  alt: string;
  fallback: ReactNode;
};
export default function CustomAvatar({
  alt,
  fallback,
  src = "https://github.com/shadcn.png",
}: CustomAvatarProps) {
  return (
    <Avatar className={"w-8 h-8"}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-gray-600">{fallback}</AvatarFallback>
    </Avatar>
  );
}
