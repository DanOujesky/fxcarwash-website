import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import CustomCard from "../components/CustomCard";
import CartIcon from "../components/CartIcon";

function AccountPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
      <div className="flex justify-center items-center header-color p-20 border-b-1">
        <h1 className="text-3xl">Zhýhodněné FX Karty</h1>
        <CartIcon />
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        <h2 className="text-2xl underline">Moje Karty</h2>
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        {user.cards.length > 0 ? (
          user.cards.map((card) => (
            <div key={card.id}>
              <CustomCard credit={card.credit} number={card.number} />
            </div>
          ))
        ) : (
          <p className="">Zatím nemáte žádnou FX kartu</p>
        )}
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        <Link
          to="/objednat-kartu"
          className="bg-green-500 hover:bg-green-600 p-2 inline-block  rounded-sm mt-5"
        >
          Chci FX kartu
        </Link>
        <Link
          to="/dobit-kartu"
          className="bg-transparent border-2 hover:bg-[#1b1b1b] p-2 inline-block  rounded-sm mt-5"
        >
          Dobít kredit
        </Link>
      </div>
    </div>
  );
}

export default AccountPage;
