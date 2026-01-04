import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import { useCart } from "../context/CartContext";

function CartPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { cart, hasDelivery } = useCart();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

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
                    <div className="">Cena: {item.prize}</div>
                  </div>
                ) : (
                  <div>
                    <div className=" flex flex-col">
                      <div className="font-semibold">{item.name}</div>
                      <div className="">Číslo karty: {item.cardNumber}</div>
                    </div>
                    <div className="">Cena: {item.prize}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center items-center body-bg-color p-15">
            <Link
              to={`${hasDelivery ? "/doprava" : "/souhrn"}`}
              className="bg-green-500 hover:bg-green-600 p-2 inline-block  rounded-sm mt-5"
            >
              Pokračovat
            </Link>
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
