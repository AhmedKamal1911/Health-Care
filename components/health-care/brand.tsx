import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-[10px] w-fit">
      <Image
        priority
        height={32}
        width={32}
        alt="logo"
        src={"/assets/icons/Logomark.svg"}
      />
      <h1 className="font-bold text-[24px]">CarePulse</h1>
    </Link>
  );
}
