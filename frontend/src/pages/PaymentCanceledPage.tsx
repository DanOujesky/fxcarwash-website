import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function PaymentCanceledPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen body-bg-color pt-[121px] sm:pt-[185px] text-white">
      <Header homePage={false} logo={false} withoutPadding />

      <div className="max-w-[720px] mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6 w-full header-color border border-white/10 rounded-xl p-8 shadow-lg text-center">
          <img
            src="/icons/cancel_icon.svg"
            alt="canceled"
            className="w-14 h-14"
          />

          <p className="text-lg font-medium">Platba byla zrušena</p>

          <div>
            <p className="text-sm text-white/70 max-w-md">
              Platba nebyla dokončena.
            </p>
            <p className="text-sm text-white/70 max-w-md">
              Pokud došlo k chybě, můžete objednávku zkusit zaplatit znovu.
            </p>
          </div>

          {orderId && (
            <p className="text-xs text-white/50">Číslo objednávky: {orderId}</p>
          )}

          <div className="flex flex-col gap-4 pt-6 w-full">
            <Link
              to="/kosik"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition text-center"
            >
              Zpět do košíku
            </Link>

            <Link
              to="/"
              className="flex-1 border border-white/20 text-white py-3 rounded-lg text-center hover:bg-white/5 transition"
            >
              Domů
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PaymentCanceledPage;
