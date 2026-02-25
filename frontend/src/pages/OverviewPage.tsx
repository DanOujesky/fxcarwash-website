import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import { Order } from "../types/Order";
import Footer from "../components/Footer";
import { formatCurrency } from "../utils/formater";

function OverviewPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [onCompany, setOnCompany] = useState(false);

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order: order }),
          credentials: "include",
        },
      );
      const data = await res.json();

      if (res.ok) {
        window.location.href = data.url;
      } else {
        console.error("Chyba při vytváření platební relace:", data.errors);
      }
    } catch (error) {
      console.error("Chyba při platbě:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] bg-[#252525]">
      <Header
        withoutPadding={true}
        account={true}
        homePage={false}
        logo={false}
      />
      {order && order.items.length > 0 ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col justify-center items-center body-bg-color pt-15">
            <CartPhaseDisplay
              delivery={order.address ? true : false}
              phaseNumber={3}
            />
          </div>
          <div className="flex flex-col justify-center items-center body-bg-color pt-15">
            <h2 className="text-2xl underline">Shrnutí objednávky</h2>
          </div>
          <div className="flex flex-col justify-center items-center body-bg-color gap-5 pt-15 contactText ">
            {order.items.map((item) => (
              <div
                className="border-2 border-white p-5 justify-between w-[80%] sm:w-150"
                key={item.temp_id}
              >
                {item.shipping ? (
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 justify-between">
                    <div className=" flex flex-col">
                      {" "}
                      <div className=" flex flex-col">
                        <div className="font-bold ">
                          {item.name === "Objednání nové FX karty"
                            ? "FX karta v hodnotě " + item.price + " Kč"
                            : ""}
                        </div>
                      </div>
                      <div className=" text-green-500">
                        Množství kreditů s {user.discount}% bonusem:{" "}
                        {item.credit} kreditů
                      </div>
                    </div>

                    <div className=" flex flex-col items-center justify-center gap-2">
                      {item.shipping && (
                        <div className="flex flex-col items-center justify-center text-2xl">
                          {item.quantity} ks
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 justify-between">
                    <div className=" flex flex-col">
                      {" "}
                      <div className=" flex flex-col">
                        <div className="font-bold ">
                          {`Dobití kreditu ${item.price} Kč na FX kartu č. ${item.cardNumber}`}
                        </div>
                      </div>
                      <div className="text-green-500">
                        Množství kreditů s {user.discount}% bonusem:{" "}
                        {item.credit} kreditů
                      </div>
                    </div>
                    <div className=" flex flex-col items-center justify-center gap-2">
                      <div className="flex flex-col items-center justify-center text-2xl">
                        1 ks
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {order.address ? (
            <div className="flex flex-col justify-center items-center body-bg-color">
              <div className="border-2 flex flex-col  border-white p-5 justify-between gap-10 sm:w-150 w-[80%] mt-5 ">
                <div className="flex flex-col justify-baseline self-start">
                  <div className="mb-2">
                    <p className="font-bold underline">Kontaktní údaje</p>
                    <p>
                      {user.firstName} {user.lastName}
                    </p>
                    <p>{user.email}</p>
                    <p>{order.phone}</p>
                  </div>
                  <div className="mb-2">
                    <p className="font-bold underline">Doručovací adresa</p>
                    <p>
                      {order.address}, {order.zipCode} {order.city}{" "}
                      {order.country}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row justify-between self-start w-full">
                  <p className="font-bold">Celková cena s DPH</p>
                  <p className="text-green-500 text-2xl">
                    {formatCurrency(order.price)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center body-bg-color ">
              <div className="border-2 flex flex-col border-white p-5 justify-center gap-10 w-150 mt-5">
                <div className="flex flex-col justify-baseline self-start w-full">
                  <div className="mb-2">
                    <p className="font-bold underline">Kontaktní údaje</p>
                    <p>
                      {user.firstName} {user.lastName}
                    </p>
                    <p>{user.email}</p>
                    <p>{user.phone}</p>
                  </div>
                </div>
                <div className="flex flex-row justify-between self-start w-full">
                  <p className="font-bold">Celková cena s DPH</p>
                  <p className="text-green-500 text-2xl">
                    {formatCurrency(order.price)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-row justify-center items-center  body-bg-color pt-15 mx-10  ">
            <div className="w-150 flex justify-start items-center gap-5 ">
              <input
                type="checkbox"
                id="gdpr"
                className="w-7 h-7 shrink-0 accent-green-500 cursor-pointer "
                checked={onCompany}
                onChange={() => setOnCompany(!onCompany)}
              />
              <label className="text-white leading-none contactText ">
                Chci nakupovat na firmu
              </label>
            </div>
          </div>
          {onCompany && (
            <div className="flex flex-col justify-center items-center body-bg-color pt-5 mx-10"></div>
          )}
          <div className="flex flex-row justify-center items-center body-bg-color pt-5 mx-10">
            <div className="w-150 flex justify-start items-center gap-5 ">
              <input
                type="checkbox"
                id="gdpr"
                className="w-7 h-7 shrink-0 accent-green-500 cursor-pointer"
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
              />
              <label className="text-white leading-none contactText">
                Souhlasím s{" "}
                <Link className="underline" to="/obchodni-podminky">
                  obchodními podmínkami
                </Link>{" "}
                a se zpracováním osobních údajů
              </label>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center body-bg-color p-15">
            <div className="flex flex-col w-55 sm:w-80">
              <button
                onClick={handlePayment}
                className={`${
                  !isAgreed
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } p-2 inline-block rounded-sm mt-5 text-white`}
                disabled={isLoading || !isAgreed}
              >
                {isLoading ? "přesměrování..." : "Zaplatit"}
              </button>
              <Link
                to={`${order.address ? "/doprava" : "/kosik"}`}
                className="bg-transparent border-2 hover:bg-[#1b1b1b] p-2 inline-block  rounded-sm mt-5 text-center"
              >
                Zpět
              </Link>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-col justify-center items-center body-bg-color pt-15">
          <div className="text-white">
            <h2>V košíku dosud nemáte žádné zboží</h2>
            <p>
              Pokračujte prosím na{" "}
              <Link to="/moje-karty" className="underline">
                hlavní stránku
              </Link>
            </p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default OverviewPage;
