type AnimatedDivProps = {
  rightSite: boolean;
  title: string;
  text: string;
};

function AnimatedDiv({ title, text }: AnimatedDivProps) {
  return (
    <div className="flex flex-col gap-6 lg:gap-10 items-center justify-center">
      <h3 className="text-2xl lg:text-4xl text-center ">{title}</h3>
      <p className="text-[13px] text-justify ">{text}</p>
    </div>
  );
}

export default AnimatedDiv;
