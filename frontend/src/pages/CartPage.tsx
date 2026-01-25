import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import { useCart } from "../context/CartContext";
import type { Order } from "../types/Order";
import QuantityInput from "../components/QuantityInput";

function CartPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { cart, hasDelivery, totalPrice, updateCartQuantity, removeFromCart } =
    useCart();

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
        price: totalPrice,
        email: user.email,
      };
      localStorage.setItem("order", JSON.stringify(newOrder));

      navigate("/souhrn", { state: { order: newOrder } });
    }
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] bg-[#252525]">
      <Header
        account={true}
        homePage={false}
        logo={false}
        withoutPadding={true}
      />
      {cart && cart.length > 0 ? (
        <div>
          <div className="flex flex-col justify-center items-center body-bg-color pt-15">
            <CartPhaseDisplay delivery={hasDelivery} phaseNumber={1} />
          </div>
          <div className="flex flex-col justify-center items-center body-bg-color gap-5 pt-15 contactText ">
            {cart.map((item) => (
              <div
                className="border-2 border-white p-5 justify-between w-[80%] sm:w-150"
                key={item.id}
              >
                {item.delivery ? (
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 justify-between">
                    <div className=" flex flex-col">
                      {" "}
                      <div className=" flex flex-col">
                        <div className="font-bold">{item.name}</div>
                      </div>
                      <div className="">
                        Váš požadavek na dobití kreditu: {item.price} kreditů
                      </div>
                      <div className="">Vaše cena: {item.price} Kč</div>
                      <div className="mt-3 text-green-500">
                        Výše kreditu s bonusem {user.discount}% od nás:{" "}
                        {item.credit} kreditů
                      </div>
                    </div>

                    <div className=" flex flex-col items-center justify-center gap-2">
                      <div
                        onClick={() => removeFromCart(item.temp_id)}
                        className={`w-15 flex flex-col items-center justify-center ${item.shipping ? "" : "mr-[24.5px]"}`}
                      >
                        <img
                          className="self-center invert w-full h-full object-cover cursor-pointer"
                          src="/icons/trash-icon.svg"
                        ></img>
                      </div>
                      {item.shipping && (
                        <QuantityInput
                          value={item.quantity || 1}
                          onChange={(newQuantity) => {
                            updateCartQuantity(item.temp_id, newQuantity);
                          }}
                          size={30}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 justify-between">
                    <div className=" flex flex-col">
                      {" "}
                      <div className=" flex flex-col">
                        <div className="font-bold">{item.name}</div>
                        {!item.shipping && (
                          <div className="">Číslo karty: {item.cardNumber}</div>
                        )}
                      </div>
                      <div className="">
                        Váš požadavek na dobití kreditu: {item.price} kreditů
                      </div>
                      <div className="">Vaše cena: {item.price} Kč</div>
                      <div className="mt-3 text-green-500">
                        Výše kreditu s bonusem {user.discount}% od nás:{" "}
                        {item.credit} Kreditů
                      </div>
                    </div>
                    <div className=" flex flex-col items-center justify-center gap-2">
                      <div
                        onClick={() => removeFromCart(item.temp_id)}
                        className={`w-15 flex flex-col items-center justify-center  ${item.shipping ? "" : "sm:mr-[24.5px]"}`}
                      >
                        <img
                          className="self-center invert w-full h-full object-cover cursor-pointer"
                          src="/icons/trash-icon.svg"
                        ></img>
                      </div>
                      {item.shipping && (
                        <QuantityInput
                          value={item.quantity || 1}
                          onChange={(newQuantity) => {
                            updateCartQuantity(item.temp_id, newQuantity);
                          }}
                          size={30}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="w-[80%] sm:w-150 flex justify-between items-center text-white text-xl pt-5">
              <div className="font-bold underline underline-offset-8">
                Celková cena: {totalPrice} Kč
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center body-bg-color p-15">
            <div className="flex flex-col w-55 sm:w-80">
              <button
                onClick={handleContinue}
                className="bg-green-500 hover:bg-green-600 p-2 inline-block  rounded-sm mt-5 cursor-pointer"
              >
                Pokračovat
              </button>
              <Link
                to="/moje-karty"
                className="bg-transparent border-2 hover:bg-[#1b1b1b] p-2 inline-block  rounded-sm mt-5 text-center"
              >
                Zpět k nákupu
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center body-bg-color pt-15">
          <div className="text-white text-center">
            <h2>V košíku nemáte žádné zboží</h2>
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
