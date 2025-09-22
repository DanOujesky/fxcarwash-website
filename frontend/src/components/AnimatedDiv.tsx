type AnimatedDivProps = {
  rightSite: boolean;
  title: string;
  text: string;
};

function AnimatedDiv({ title, text }: AnimatedDivProps) {
  return (
    <div className="flex flex-col gap-10 items-center justify-center">
      <h3 className="text-4xl">{title}</h3>
      <p className="text-[14px]">{text}</p>
    </div>
  );
}

export default AnimatedDiv;
