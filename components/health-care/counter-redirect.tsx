"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  path: string;
  duration?: number;
};
export default function CounterRedirect({ duration = 10, path }: Props) {
  const router = useRouter();
  const [countDownValue, setCountDownValue] = useState(duration);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("from interval");
      if (!countDownValue) {
        clearInterval(intervalId);
        router.replace(path);
        return;
      }
      setCountDownValue((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [countDownValue, path, router]);
  return (
    <div className="text-center mt-4 font-bold">
      <span
        className={`transition-all ${
          countDownValue <= 5 ? "text-red-600" : ""
        }`}
      >
        {!countDownValue
          ? "Redirecting ..."
          : `Redirecting to login page in ${countDownValue}`}
      </span>
    </div>
  );
}
