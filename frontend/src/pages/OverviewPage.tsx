import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import { Order } from "../types/Order";

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
    <div className="min-h-screen bg-[#252525]">
      <Header account={true} homePage={false} logo={false} />
      {order && order.items.length > 0 ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col justify-center items-center body-bg-color pt-15">
            <CartPhaseDisplay
              delivery={order.address ? true : false}
              phaseNumber={3}
            />
          </div>
          <div className="flex flex-col justify-center items-center body-bg-color pt-15">
            <h2 className="text-2xl underline">Produkty</h2>
          </div>
          <div className="flex flex-col justify-center items-center body-bg-color gap-5 pt-15 contactText ">
            {order.items.map((item) => (
              <div
                className="border-2 flex flex-row border-white p-5 justify-between w-150"
                key={item.id}
              >
                {item.delivery ? (
                  <div>
                    <div className=" flex flex-col">
                      <div className="font-semibold">{item.name}</div>
                    </div>
                    <div className="">
                      Váš požadavek na dobití kreditu: {item.price} kreditů
                    </div>
                    <div className="">Vaše cena: {item.price} Kč</div>
                    <div className="mt-3">
                      Výše kreditu s bonusem {user.discount}% od nás:{" "}
                      {item.credit} kreditů
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className=" flex flex-col">
                      <div className="font-semibold">{item.name}</div>
                      {!item.shipping && (
                        <div className="">Číslo karty: {item.cardNumber}</div>
                      )}
                    </div>

                    <div className="">Vaše cena: {item.price} Kč</div>
                    <div className="mt-3">
                      Výše kreditu s bonusem {user.discount}% pro vás:{" "}
                      {item.credit} Kreditů
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {order.address ? (
            <div className="flex flex-col justify-center items-center body-bg-color pt-15">
              <h2 className="text-2xl underline">Údaje</h2>
              <div className="border-2 flex flex-row border-white p-5 justify-between w-150 mt-15">
                <div className="flex flex-col justify-baseline self-start">
                  <p>Jméno: {user.firstName}</p>
                  <p>Příjmení: {user.lastName}</p>
                  <p>Email: {user.email}</p>
                  <p>Telefon: {order.phone}</p>
                </div>
                <div className="flex flex-col justify-baseline">
                  <p>Adresa: {order.address}</p>
                  <p>PSČ: {order.zipCode}</p>
                  <p>Město: {order.city}</p>
                  <p>Stát: {order.country}</p>
                </div>
              </div>
              <div className="w-150 flex justify-between items-center text-white text-xl pt-5">
                <div className="underline underline-offset-8 contactText font-bold">
                  Celková cena: {order.price} Kč
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center body-bg-color pt-15">
              <h2 className="text-2xl underline">Údaje</h2>
              <div className="border-2 flex flex-row border-white p-5 justify-center gap-10 w-150 mt-15">
                <div className="flex flex-col justify-baseline self-start w-full">
                  <p>Jméno: {user.firstName}</p>
                  <p>Příjmení: {user.lastName}</p>
                  <p>Email: {user.email}</p>
                </div>
              </div>
              <div className="w-150 flex justify-between items-center text-white text-xl pt-5">
                <div className="underline underline-offset-8">
                  Celková cena: {order.price} Kč
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-row justify-center items-center gap-5 body-bg-color pt-15">
            <input
              type="checkbox"
              id="gdpr"
              className="w-7 h-7 accent-green-500 cursor-pointer"
              checked={isAgreed}
              onChange={() => setIsAgreed(!isAgreed)}
            />
            <label
              htmlFor="gdpr"
              className="text-white leading-none contactText cursor-pointer"
            >
              Souhlasím s obchodními podmínkami a se zpracováním osobních údajů
            </label>
          </div>
          <div className="flex flex-col justify-center items-center body-bg-color p-15">
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
              to="/moje-karty"
              className="bg-transparent border-2 hover:bg-[#1b1b1b] p-2 inline-block  rounded-sm mt-5"
            >
              Zpět k nákupu
            </Link>
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
    </div>
  );
}

export default OverviewPage;
