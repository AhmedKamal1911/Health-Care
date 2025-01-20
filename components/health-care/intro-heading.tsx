type Props = {
  title: string;
  desc: string;
};
export function IntroHeading({ desc, title }: Props) {
  return (
    <div>
      <span className="font-bold text-4xl">{title}</span>
      <p className="text-tertiary mt-[18px]">{desc}</p>
    </div>
  );
}
