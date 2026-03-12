import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import { useCart } from "../context/CartContext";
import type { Order } from "../types/Order";
import QuantityInput from "../components/QuantityInput";
import Footer from "../components/Footer";
import { formatCurrency } from "../utils/formater";
import OrderSummary from "../components/OrderSummary";

function CartPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { cart, hasDelivery, totalPrice, updateCartQuantity, removeFromCart } =
    useCart();

  const savedOrderString = localStorage.getItem("order");

  let savedOrder = null;

  try {
    savedOrder = savedOrderString ? JSON.parse(savedOrderString) : null;
  } catch (e) {
    console.error("Chyba při parsování objednávky:", e);
  }

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const handleContinue = () => {
    if (hasDelivery || !user.address) {
      navigate("/doprava");
    } else {
      const newOrder: Order = {
        ...savedOrder,
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
    <div className="min-h-screen pt-[121px] sm:pt-[185px] bg-[#252525] text-white">
      <Header
        account={true}
        homePage={false}
        logo={false}
        withoutPadding={true}
      />

      {cart && cart.length > 0 ? (
        <>
          <div className="flex justify-center pt-12">
            <CartPhaseDisplay
              delivery={hasDelivery || !user.address}
              phaseNumber={1}
            />
          </div>
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row gap-12 pt-16 pb-20">
            <div className="flex flex-col gap-6 w-full">
              {cart.map((item) => (
                <div
                  key={item.temp_id}
                  className="w-full bg-[#1b1b1b] border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row justify-between gap-6 shadow-lg hover:border-white/20 transition"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>

                    {!item.shipping && !item.delivery && (
                      <p className="text-gray-400 text-sm">
                        Číslo karty: {item.cardNumber}
                      </p>
                    )}

                    <p className="text-gray-300 mt-2">
                      Váš požadavek na dobití kreditu: {item.price} kreditů
                    </p>

                    <p className="font-medium">
                      Vaše cena: {formatCurrency(item.price)}
                    </p>

                    <p className="text-green-400 text-sm mt-1">
                      Bonus {user.discount}% → {item.credit} kreditů
                    </p>
                  </div>

                  <div
                    className={`flex flex-col items-center justify-center gap-3`}
                  >
                    <button
                      onClick={() => removeFromCart(item.temp_id)}
                      className={`flex items-center justify-center rounded-md cursor-pointer`}
                    >
                      <img
                        className="invert w-15 h-15"
                        src="/icons/trash-icon.svg"
                        alt="remove"
                      />
                    </button>

                    <QuantityInput
                      value={item.quantity || 1}
                      onChange={(newQuantity) =>
                        updateCartQuantity(item.temp_id, newQuantity)
                      }
                      size={30}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-[420px] flex flex-col gap-6">
              <OrderSummary totalPrice={totalPrice} />

              <button
                onClick={handleContinue}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition cursor-pointer"
              >
                Pokračovat
              </button>

              <Link
                to="/moje-karty"
                className="w-full border border-white/20 text-white py-3 rounded-lg text-center hover:bg-white/5 transition"
              >
                Zpět k nákupu
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center py-32">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              V košíku nemáte žádné zboží
            </h2>

            <p className="text-gray-400">
              Pokračujte prosím na{" "}
              <Link to="/moje-karty" className="underline hover:text-white">
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

export default CartPage;
