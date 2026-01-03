function Inputlabel({ text, white }: { text: string; white?: boolean }) {
  return (
    <label className={`${white ? "text-white" : "text-black"} text-[13px]`}>
      {text}
    </label>
  );
}

export default Inputlabel;
