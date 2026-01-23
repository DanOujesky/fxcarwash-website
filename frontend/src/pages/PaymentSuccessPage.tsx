function PaymentSuccessPage() {
  localStorage.removeItem("order");
  localStorage.removeItem("cart");

  const handleReturn = () => {
    window.location.href = "/moje-karty";
  };

  return (
    <div className="bg-black h-screen w-full flex justify-center items-center flex-col gap-2 text-center">
      <div className="text-[15px] sm:text-[20px]">Platba probehla úspěšně</div>
      <div className="w-10">
        <img src="/icons/successful_icon.svg" alt="successful-icon" />
      </div>
      <button
        onClick={handleReturn}
        className="mt-10 bg-white text-black p-2 hover:bg-gray-300"
      >
        Vrátit se zpět
      </button>
    </div>
  );
}

export default PaymentSuccessPage;
