import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import CustomCard from "../components/CustomCard";
import Inputlabel from "../components/InputLabel";
import Header from "../components/Header";
import type { OrderItem } from "../types/Order";
import { z } from "zod";
import { useCart } from "../context/CartContext";

const addCreditSchema = z.object({
  selectedCardNumber: z.string().min(1, "Musíte vybrat kartu"),
  credit: z
    .number()
    .min(500, "Minimální výše kreditu je 500 Kč")
    .max(10000, "Maximální výše kreditu je 10 000 Kč"),
});

function GetCreditPage() {
  const { user, loading } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedCardNumber, setSelectedCardNumber] = useState("");
  const [credit, setCredit] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    selectedCardNumber?: string;
    credit?: string;
  }>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
    if (user && user.cards.length < 1) {
      navigate("/moje-karty", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const addCredit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validation = addCreditSchema.safeParse({
      selectedCardNumber,
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

    const orderItem: OrderItem = {
      id: crypto.randomUUID(),
      name: "Dobýt kredit",
      prize: credit,
      delivery: false,
      cardNumber: selectedCardNumber,
    };
    addToCart(orderItem);
    navigate("/kosik");

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#252525]">
      <Header account={true} homePage={false} />
      <div className="flex flex-col justify-center items-center body-bg-color pt-15">
        <h2 className="text-2xl underline">Dobití kreditu</h2>
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        <form className="my-5 flex flex-col gap-3" onSubmit={addCredit}>
          <div className="flex flex-col">
            <Inputlabel white={true} text="Vyberte Kartu" />
            <div>
              {user.cards.length > 0 ? (
                user.cards.map((card) => (
                  <div
                    className="my-2 cursor-pointer"
                    key={card.id}
                    onClick={() => setSelectedCardNumber(card.number)}
                  >
                    <CustomCard
                      hover={true}
                      isSelected={selectedCardNumber === card.number}
                      credit={card.credit}
                      number={card.number}
                    />
                  </div>
                ))
              ) : (
                <p className="">Zatím nemáte žádnou FX kartu</p>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <Inputlabel white={true} text="Vyberte výši kreditu" />
            <select
              onChange={(e) => {
                setCredit(Number(e.target.value));
              }}
              className=" bg-white text-black p-2 cursor-pointer contactText "
              defaultValue={500}
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
          <p className="text-white">
            {`Ke zvolené výši kreditu nahrajeme ${user.discount}% navíc jako
              bonus pro Vás.`}
          </p>
          <div className="text-white contactText">
            Vaše cena: <span className="">{credit} Kč</span>
          </div>
          <div className="text-white contactText">
            Nahraný kredit:{" "}
            <span className="">{credit * (1 + user.discount / 100)} Kč</span>
          </div>
          {errors && (
            <span className="text-red-500 text-center text-sm contactText">
              {errors.selectedCardNumber}
            </span>
          )}
          {errors.credit && (
            <span className="text-red-500 text-center text-sm contactText">
              {errors.credit}
            </span>
          )}
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

export default GetCreditPage;
