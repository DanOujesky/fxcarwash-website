import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import CustomCard from "../components/CustomCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AccountPage() {
  const { user, loading, refreshCards } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!loading && user) {
      refreshCards();
    }
  }, [loading]);

  if (loading || !user) {
    return <div className={`bg-black min-h-screen]`} />;
  }
  return (
    <div className={`min-h-screen pt-[121px] sm:pt-[185px] body-bg-color`}>
      <Header
        account={true}
        homePage={false}
        logo={false}
        withoutPadding={true}
      />
      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        <h2 className="text-2xl underline text-center">Moje Karty</h2>
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color">
        {user.cards && user.cards.length > 0 ? (
          [...user.cards]
            .sort((a, b) => Number(a.number) - Number(b.number))
            .map((card) => (
              <div key={card.id} className="my-1 w-[80%] sm:w-140 lg:w-160">
                <CustomCard
                  credit={card.credit}
                  number={card.number}
                  status={card.status === "ASSIGNED" ? 1 : 2}
                />
              </div>
            ))
        ) : (
          <p>Zatím nemáte žádnou FX kartu</p>
        )}
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        <div className="flex flex-col w-55 sm:w-80 gap-4">
          <Link
            to="/objednat-kartu"
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-center transition"
          >
            Chci FX kartu
          </Link>

          <button
            onClick={() => {
              if (user.cards.length < 1) {
                alert("Nejdříve si musíte objednat FX kartu");
                return;
              }

              navigate("/dobit-kartu");
            }}
            className="border border-white/20 text-white py-3 rounded-lg hover:bg-white/5 transition"
          >
            Dobít kredit
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AccountPage;
