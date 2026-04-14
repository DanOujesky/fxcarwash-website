import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function PaymentSuccessPage() {
  useEffect(() => {
    localStorage.removeItem("order");
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="min-h-screen body-bg-color pt-[121px] sm:pt-[185px] text-white">
      <Header homePage={false} logo={false} withoutPadding />
      <div className="max-w-[720px] mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6 w-full header-color border border-white/10 rounded-xl p-8 shadow-lg text-center">
          <img
            src="/icons/successful_icon.svg"
            alt="success"
            className="w-14 h-14"
          />

          <p className="text-lg font-medium">Platba proběhla úspěšně</p>

          <div>
            <p className="text-sm text-white/70 max-w-md">
              Děkujeme za váš nákup na fxcarwash!
            </p>
            <p className="text-sm text-white/70 max-w-md">
              Objednávku jsme v pořádku přijali. Vše důležité jsme zaslali na
              váš email.
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-6 w-full">
            <Link
              to="/moje-karty"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition text-center"
            >
              Moje karty
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

export default PaymentSuccessPage;
