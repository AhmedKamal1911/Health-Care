import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  text: string;
};
export default function SectionWrapper({ children, text }: Props) {
  return (
    <div>
      <span className="mb-9 block font-bold text-2xl md:text-3xl">{text}</span>
      {children}
    </div>
  );
}
