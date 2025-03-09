type Props = {
  title: string;
  desc?: string;
};
export function IntroHeading({ desc, title }: Props) {
  return (
    <div>
      <span className="font-bold text-xl min-[300px]:text-2xl md:text-3xl lg:text-4xl">
        {title}
      </span>
      <p className="text-tertiary mt-[18px]">{desc}</p>
    </div>
  );
}
