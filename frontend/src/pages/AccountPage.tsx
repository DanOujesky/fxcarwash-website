import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import CustomCard from "../components/CustomCard";
import Header from "../components/Header";

function AccountPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className={`bg-black min-h-screen]`} />;
  }
  return (
    <div className={`min-h-screen pt-[121px] sm:pt-[185px] bg-[#252525]`}>
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
        {user.cards.length > 0 ? (
          [...user.cards]
            .sort((a, b) => Number(a.number) - Number(b.number))
            .map((card) => (
              <div key={card.id} className="my-1 w-[80%] sm:w-120">
                <CustomCard credit={card.credit} number={card.number} />
              </div>
            ))
        ) : (
          <p>Zatím nemáte žádnou FX kartu</p>
        )}
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        <div className="flex flex-col w-55 sm:w-80">
          <Link
            to="/objednat-kartu"
            className="bg-green-500 hover:bg-green-600 p-2 inline-block  rounded-sm mt-5 text-center"
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
            className="bg-transparent border-2 hover:bg-[#1b1b1b] p-2 inline-block  rounded-sm mt-5"
          >
            Dobít kredit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
