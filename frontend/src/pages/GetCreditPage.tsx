import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import CartIcon from "../components/CartIcon";
import CustomCard from "../components/CustomCard";
import Inputlabel from "../components/InputLabel";

function GetCreditPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [selectedCardId, setSelectedCardId] = useState("");
  const [credit, setCredit] = useState(500);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const addCredit = () => {};

  return (
    <div className="min-h-screen bg-[#252525]">
      <div className="flex justify-center items-center header-color p-20 border-b-1">
        <h1 className="text-3xl">Dobití Kreditu</h1>
        <CartIcon />
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        <form className="my-5 flex flex-col gap-3" onSubmit={addCredit}>
          <div className="flex flex-col">
            <Inputlabel white={true} text="Vyberte Kartu" />
            <div>
              {user.cards.length > 0 ? (
                user.cards.map((card) => (
                  <div key={card.id} onClick={() => setSelectedCardId(card.id)}>
                    <CustomCard
                      hover={true}
                      isSelected={selectedCardId === card.id}
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
