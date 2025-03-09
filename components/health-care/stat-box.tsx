import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { LucideProps } from "lucide-react";

import { CSSProperties, ForwardRefExoticComponent, RefAttributes } from "react";

type Props = {
  className?: ClassValue;
  desc: string;
  statValue: string;
  iconColor?: `text-${string}`;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  spotLightColor?: `bg-${string}`;
  iconStyles?: CSSProperties;
};
export default function StatBox({
  className,
  desc,
  statValue,
  icon: Icon,
  spotLightColor = "bg-secondary",
  iconColor,
  iconStyles,
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden stat-box-gradient backdrop-blur-sm  border-t border-b border-[#FFFFFF14] px-6 py-8 rounded-xl",
        className
      )}
    >
      <div className="flex items-center gap-[14px] mb-6">
        <Icon className={`size-8 ${iconColor}`} style={iconStyles} />
        <span className="text-[32px] font-bold">{statValue}</span>
      </div>
      <p>{desc}</p>

      <div
        className={`absolute size-28 ${spotLightColor} bottom-0 translate-y-1/2 blur-[72px] rounded-full  start-3 -z-10 opacity-[0.3]`}
      ></div>
    </div>
  );
}
