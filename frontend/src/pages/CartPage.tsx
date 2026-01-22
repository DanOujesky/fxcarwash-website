import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import { useCart } from "../context/CartContext";
import type { Order } from "../types/Order";

function CartPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { cart, hasDelivery, totalPrice } = useCart();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const handleContinue = () => {
    if (hasDelivery) {
      navigate("/doprava");
    } else {
      const newOrder: Order = {
        id: crypto.randomUUID(),
        items: cart,
        createdAt: new Date(),
        price: totalPrice,
        email: user.email,
      };
      localStorage.setItem("order", JSON.stringify(newOrder));

      navigate("/souhrn", { state: { order: newOrder } });
    }
  };

  return (
    <div className="min-h-screen bg-[#252525]">
      <Header account={true} homePage={false} />
      {cart && cart.length > 0 ? (
        <div>
          <div className="flex flex-col justify-center items-center body-bg-color pt-15">
            <CartPhaseDisplay delivery={hasDelivery} phaseNumber={1} />
          </div>
          <div className="flex flex-col justify-center items-center body-bg-color gap-5 pt-15 contactText ">
            {cart.map((item) => (
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
                      Váš požadavek na dobití kreditu: {item.prize} kreditů
                    </div>
                    <div className="">Vaše cena: {item.prize} Kč</div>
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
                    <div className="">
                      Váš požadavek na dobití kreditu: {item.prize} kreditů
                    </div>
                    <div className="">Vaše cena: {item.prize} Kč</div>
                    <div className="mt-3">
                      Výše kreditu s bonusem {user.discount}% pro vás:{" "}
                      {item.credit} Kreditů
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center items-center body-bg-color p-15">
            <button
              onClick={handleContinue}
              className="bg-green-500 hover:bg-green-600 p-2 inline-block  rounded-sm mt-5 cursor-pointer"
            >
              Pokračovat
            </button>
            <Link
              to="/moje-karty"
              className="bg-transparent border-2 hover:bg-[#1b1b1b] p-2 inline-block  rounded-sm mt-5"
            >
              Zpět k nákupu
            </Link>
          </div>
        </div>
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

export default CartPage;
