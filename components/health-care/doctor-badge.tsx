import { cn, generateTextFallback } from "@/lib/utils";
import { Badge } from "../ui/badge";
import CustomAvatar from "./custom-avatar";
type Props = {
  doctorName: string;
  src?: string;
  className?: string;
};
export default function DoctorBadge({
  doctorName,
  src = undefined,
  className,
}: Props) {
  return (
    <Badge className={cn("gap-2", className)}>
      <CustomAvatar
        src={src}
        fallback={
          <span className="capitalize">{generateTextFallback(doctorName)}</span>
        }
        alt="Doctor"
      />
      {doctorName}
    </Badge>
  );
}
