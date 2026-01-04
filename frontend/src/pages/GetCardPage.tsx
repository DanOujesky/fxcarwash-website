import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import Inputlabel from "../components/InputLabel";
import Header from "../components/Header";
import { z } from "zod";
import QuantityInput from "../components/QuantityInput";
import { useCart } from "../context/CartContext";
import type { OrderItem } from "../types/Order";

const newCardSchema = z.object({
  shipping: z.enum(["cp", "op"], {
    error: "Zvojte způsob dopravy",
  }),

  quantity: z
    .number()
    .int("Množství musí být celé číslo")
    .min(1, "Minimální množství je 1 kus")
    .max(100, "Maximální množství je 100 kusů"),

  credit: z
    .number()
    .min(500, "Minimální výše kreditu je 500 Kč")
    .max(10000, "Maximální výše kreditu je 10 000 Kč"),
});

function GetCardPage() {
  const { user, loading } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [credit, setCredit] = useState(500);
  const [quantity, setQuantity] = useState(1);
  const [shipping, setShipping] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{
    shipping?: string;
    quantity?: string;
    credit?: string;
  }>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const addCard: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validation = newCardSchema.safeParse({
      shipping,
      quantity,
      credit,
    });

    if (!validation.success) {
      const formattedErrors: typeof errors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof formattedErrors;
        formattedErrors[field] = issue.message;
      });

      setErrors(formattedErrors);
      setIsLoading(false);
      return;
    }

    const newOrderItem: OrderItem = {
      id: crypto.randomUUID(),
      name: "Objednání nové FX karty",
      prize: credit,
      delivery: shipping === "cp",
      shipping: shipping,
      quantity: quantity,
      credit: credit * (1 + user.discount / 100),
    };

    addToCart(newOrderItem);

    navigate("/kosik");
    setIsLoading(false);
  };
  return (
    <div className="min-h-screen bg-[#252525]">
      <Header account={true} homePage={false} />
      <div className="flex flex-col justify-center items-center body-bg-color pt-15">
        <h2 className="text-2xl underline">Objednání karty</h2>
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        <form className="my-5 flex flex-col gap-3" onSubmit={addCard}>
          <div className="flex flex-col">
            <Inputlabel white={true} text="Vyberte způsob doručení" />
            <select
              onChange={(e) => {
                setShipping(e.target.value);
              }}
              className=" bg-white text-black p-2 cursor-pointer contactText"
              defaultValue=""
            >
              <option value="" disabled hidden></option>
              <option value="cp">Česká pošta (zdarma)</option>
              <option value="op">Osobní převzetí (zdarma)</option>
            </select>
          </div>
          {shipping === "op" && (
            <p className="text-white">
              Osobní převzetí na adrese naší provozovny: K černému mostu, 330 12
              Horní Bříza. Jakmile bude Vaše karta připravena, kontaktujeme Vás
              telefonicky/mailem.
            </p>
          )}
          <div className="flex flex-col">
            <Inputlabel white={true} text="Vyberte výši kreditu" />
            <select
              value={credit}
              onChange={(e) => {
                setCredit(Number(e.target.value));
              }}
              className=" bg-white text-black p-2 cursor-pointer contactText"
            >
              <option value={500}>500</option>
              <option value={1000}>1000</option>
              <option value={1500}>1500</option>
              <option value={2000}>2000</option>
              <option value={2500}>2500</option>
              <option value={3000}>3000</option>
              <option value={4000}>4000</option>
              <option value={5000}>5000</option>
              <option value={6000}>6000</option>
              <option value={7000}>7000</option>
              <option value={8000}>8000</option>
              <option value={9000}>9000</option>
              <option value={10000}>10000</option>
            </select>
          </div>
          <div className="flex flex-col">
            <Inputlabel white={true} text="Zadejte počet Karet" />
            <QuantityInput
              value={quantity}
              onChange={(e) => {
                setQuantity(e);
              }}
            />
          </div>
          {(errors.shipping && (
            <span className="text-red-500 text-center text-sm contactText">
              {errors.shipping}
            </span>
          )) ||
            (errors.quantity && (
              <span className="text-red-500 text-center text-sm contactText">
                {errors.quantity}
              </span>
            )) ||
            (errors.credit && (
              <span className="text-red-500 text-center text-sm contactText">
                {errors.credit}
              </span>
            ))}

          <div className="flex flex-col justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 p-2 inline-block  rounded-sm mt-5"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "přidávám..." : "Přidat do košíku"}
            </button>
            <Link
              className="bg-transparent border-2 hover:bg-[#1b1b1b] p-2 inline-block  rounded-sm mt-5 text-center"
              to="/moje-karty"
            >
              Zpět
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default GetCardPage;
