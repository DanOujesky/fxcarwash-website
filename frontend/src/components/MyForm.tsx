function MyForm({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black w-full h-screen flex justify-center items-center">
      <div className=" flex justify-center items-center flex-col ">
        <div className="text-white p-10 text-3xl">F.X Carwash</div>
        <div className="bg-white p-5">
          <form className="flex flex-col gap-5  min-w-100">{children}</form>
        </div>
      </div>
    </div>
  );
}

export default MyForm;
