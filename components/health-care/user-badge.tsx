import { cn, generateTextFallback } from "@/lib/utils";
import { Badge } from "../ui/badge";
import CustomAvatar from "./custom-avatar";
type Props = {
  userName: string;
  src?: string;
  className?: string;
};
export default function UserBadge({
  userName,
  src = "https://github.com/shadcn.png",
  className,
}: Props) {
  console.log(userName);
  return (
    <Badge className={cn("gap-2 text-nowrap", className)}>
      <CustomAvatar
        src={src}
        fallback={
          <span className="capitalize">
            {generateTextFallback(userName ?? "test")}
          </span>
        }
        alt="Doctor"
      />
      {userName ?? "test"}
    </Badge>
  );
}
