import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";

import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import Footer from "../components/Footer";

import { Order } from "../types/Order";
import { formatCurrency } from "../utils/formater";

function OverviewPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [stockError, setStockError] = useState<{
    message: string;
    availableCards: number;
  } | null>(null);
  const [waitlistStatus, setWaitlistStatus] = useState<
    "idle" | "loading" | "joined" | "already"
  >("idle");

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
    setStockError(null);

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
      } else if (data.outOfStock) {
        setStockError({
          message: data.error,
          availableCards: data.availableCards ?? 0,
        });
      } else {
        showToast({
          type: "error",
          title: "Chyba platby",
          message:
            data.error ||
            "Nastala chyba při vytváření platební session. Zkuste to prosím znovu.",
        });
      }
    } catch (error) {
      console.error(error);
      showToast({
        type: "error",
        title: "Chyba připojení",
        message: "Nepodařilo se připojit k serveru. Zkuste to prosím znovu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinWaitlist = async () => {
    setWaitlistStatus("loading");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/waitlist/join`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data.alreadyJoined) {
        setWaitlistStatus("already");
      } else {
        setWaitlistStatus("joined");
        showToast({
          type: "success",
          title: "Zapsán(a) do pořadníku",
          message: "Jakmile budou karty opět skladem, dáme Vám vědět emailem.",
        });
      }
    } catch {
      setWaitlistStatus("idle");
      showToast({
        type: "error",
        title: "Chyba",
        message: "Nepodařilo se zapsat do pořadníku. Zkuste to prosím znovu.",
      });
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

          {stockError && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-red-400">
                    {stockError.availableCards === 0
                      ? "Karty nejsou momentálně na skladě"
                      : "Nedostatek karet na skladě"}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    {stockError.message}
                  </p>
                </div>
              </div>

              <div className="border-t border-red-500/20 pt-4">
                <p className="text-sm text-gray-400 mb-3">
                  Chcete být informováni, jakmile budou karty opět k dispozici?
                </p>
                {waitlistStatus === "joined" || waitlistStatus === "already" ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {waitlistStatus === "already"
                      ? "Již jste v pořadníku — dáme Vám vědět emailem."
                      : "Zapsán(a)! Dáme Vám vědět emailem."}
                  </div>
                ) : (
                  <button
                    onClick={handleJoinWaitlist}
                    disabled={waitlistStatus === "loading"}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-sm font-medium transition disabled:opacity-60"
                  >
                    {waitlistStatus === "loading"
                      ? "Zapisuji..."
                      : "Chci být informován(a)"}
                  </button>
                )}
              </div>
            </div>
          )}

          {order.items.map((item) => (
            <div
              key={item.temp_id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 header-color border border-white/10 rounded-xl p-6"
            >
              <div className="flex flex-col gap-1">
                <p className="font-medium">
                  {item.name === "Objednání nové FX karty"
                    ? `FX karta v hodnotě ${item.price} Kč`
                    : `Dobití kreditu ${item.price} Kč`}
                </p>

                {user.discount > 0 && (
                  <p className="text-green-500 text-sm">
                    Kredity:{" "}
                    {Math.round(item.credit * (1 + user.discount / 100))}
                  </p>
                )}
              </div>

              <div className="text-lg font-medium">{item.quantity || 1} ks</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-6 shadow-lg sticky top-32 flex flex-col gap-6">
            <h3 className="text-xl font-semibold">Souhrn</h3>

            <div className="flex flex-col text-sm text-gray-300 gap-2">
              <p className="font-medium text-white">Kontaktní údaje</p>
              <p>
                {user.firstName} {user.lastName}
                <br />
                {user.email}
                <br />
                {order.phone || user.phone}
              </p>
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
            {order.companyName && (
              <div className="flex flex-col gap-2 text-sm text-gray-300 border-t border-white/10 pt-4">
                <p className="font-medium text-white">Fakturační adresa</p>
                <p>
                  {order.companyName}
                  <br />
                  {order.companyAddress}
                  <br />
                  {order.companyZipCode} {order.companyCity}
                  <br />
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
