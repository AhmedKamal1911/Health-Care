import Header from "@/components/health-care/header";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function layout({ children }: Props) {
  return (
    <div className="p-3 flex flex-col gap-10 min-h-screen  bg-primary">
      <Header />

      {children}
    </div>
  );
}
