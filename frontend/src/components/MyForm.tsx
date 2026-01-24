function MyForm({
  children,
  handleFunction,
}: {
  children: React.ReactNode;
  handleFunction?: React.FormEventHandler<HTMLFormElement>;
}) {
  return (
    <div className="flex justify-center h-full bg-[#252525] w-full py-20 min-h-[calc(100vh-185px)]">
      <div className="flex justify-center flex-col w-full max-w-[420px] items-center">
        <div className="bg-white p-5 w-full">
          <form
            onSubmit={handleFunction}
            className="flex flex-col gap-5 w-full max-w-[420px]"
          >
            {children}
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyForm;
