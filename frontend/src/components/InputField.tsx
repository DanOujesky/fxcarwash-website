function InputField({ type }: { type: string }) {
  return (
    <input
      className="text-white contactText text-[14px] p-5 bg-black h-10"
      type={type}
    />
  );
}

export default InputField;
