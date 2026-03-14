import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import Footer from "../components/Footer";

import { Order } from "../types/Order";
import { formatCurrency } from "../utils/formater";

function OverviewPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const order: Order = location.state?.order;

  useEffect(() => {
    if ((!loading && !user) || !order) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate, order]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order }),
          credentials: "include",
        },
      );

      const data = await res.json();

      if (res.ok) {
        window.location.href = data.url;
      } else {
        console.error(data.errors);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoingBack = () => {
    localStorage.setItem("order", JSON.stringify(order));

    const targetPath = order.address ? "/doprava" : "/kosik";
    navigate(targetPath);
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] body-bg-color text-white">
      <Header withoutPadding account homePage={false} logo={false} />

      <div className="flex justify-center pt-12">
        <CartPhaseDisplay delivery={!!order.address} phaseNumber={3} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-[1fr_380px] gap-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">Shrnutí objednávky</h2>

          {order.items.map((item) => (
            <div
              key={item.temp_id}
              className="flex justify-between items-center header-color border border-white/10 rounded-xl p-6"
            >
              <div className="flex flex-col gap-1">
                <p className="font-medium">
                  {item.name === "Objednání nové FX karty"
                    ? `FX karta v hodnotě ${item.price} Kč`
                    : `Dobití kreditu ${item.price} Kč`}
                </p>

                <p className="text-green-500 text-sm">Kredity: {item.credit}</p>
              </div>

              <div className="text-lg font-medium">{item.quantity || 1} ks</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-6 shadow-lg sticky top-32 flex flex-col gap-6">
            <h3 className="text-xl font-semibold">Souhrn</h3>

            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <p className="font-medium text-white">Kontaktní údaje</p>
              <p>
                {user.firstName} {user.lastName}
              </p>
              <p>{user.email}</p>
              <p>{order.phone || user.phone}</p>
            </div>

            {order.address && (
              <div className="flex flex-col gap-2 text-sm text-gray-300 border-t border-white/10 pt-4">
                <p className="font-medium text-white">Doručovací adresa</p>
                <p>
                  {order.address}
                  <br />
                  {order.zipCode} {order.city}
                  <br />
                  {order.country}
                </p>
              </div>
            )}

            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
              <p className="font-medium">Celkem s DPH</p>
              <p className="text-green-500 text-2xl font-semibold">
                {formatCurrency(order.price)}
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm w-full justify-center">
              <input
                type="checkbox"
                id="gdpr"
                className="w-7 h-7 accent-green-500 cursor-pointer"
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
              />

              <label
                htmlFor="gdpr"
                className="text-white leading-none flex-1 contactText font-medium"
              >
                Souhlasím s{" "}
                <Link className="underline text-white" to="/obchodni-podminky">
                  obchodními podmínkami
                </Link>
              </label>
            </div>

            <button
              onClick={handlePayment}
              disabled={!isAgreed || isLoading}
              className={`w-full py-3 rounded-lg font-medium transition ${
                !isAgreed
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLoading ? "Přesměrování..." : "Zaplatit"}
            </button>

            <button
              onClick={handleGoingBack}
              className="w-full border border-white/20 py-3 rounded-lg hover:bg-white/5 transition"
            >
              Zpět
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OverviewPage;
