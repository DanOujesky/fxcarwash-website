function MyForm({
  children,
  handleFunction,
}: {
  children: React.ReactNode;
  handleFunction?: React.FormEventHandler<HTMLFormElement>;
}) {
  return (
    <div className=" bg-[#252525] w-full min-h-screen flex justify-center items-center py-20">
      <div className="flex justify-center items-center flex-col w-full max-w-[420px]">
        <div className="text-white p-10 text-3xl text-center">F.X. Carwash</div>

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
