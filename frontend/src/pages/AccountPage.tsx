import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import CustomCard from "../components/CustomCard";

const paymentSchema = z.object({
  number: z.string().min(1, "Číslo karty je povinné"),
  money: z.coerce
    .number()
    .min(10, "Minimální částka je 10 Kč")
    .max(50000, "Maximální částka je 50 000 Kč"),
});

function AccountPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [money, setMoney] = useState("");
  const [number, setNumber] = useState("");
  const [errors, setErrors] = useState<{ number?: string; money?: string }>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const handlePayment = async () => {
    setIsLoading(true);
    setErrors({});

    const validation = paymentSchema.safeParse({ number, money });

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

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validation.data),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.cardNotFound === true) {
        setErrors({ number: data.error || "Karta nebyla nalezena" });
        return;
      }
      if (!res.ok) {
        setErrors({ money: data.error || "Něco se nepovedlo" });
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 text-white bg-black h-screen justify-center align-center flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-center">Můj Účet</h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg text-black font-semibold mb-2">Osobní údaje</h2>
        <p className="text-gray-700">
          <span className="font-medium">Jméno:</span> {user.firstName}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Příjmení:</span> {user.lastName}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">E-mail:</span> {user.email}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Telefon:</span> {user.phone}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Ulice a číslo popisné:</span>{" "}
          {user.street}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">PSČ:</span> {user.zipCode}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Stát:</span> {user.country}
        </p>
      </div>
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg text-black font-semibold mb-2">Karty</h2>
        {user.cards.length > 0 ? (
          user.cards.map((card) => (
            <CustomCard
              credit={card.credit}
              number={card.number}
              key={card.id}
            />
          ))
        ) : (
          <p className="text-gray-700">Nemáte žádnou kartu</p>
        )}
        <button className="bg-green-500 p-2 inline-block hover:bg-green-600 rounded-sm mt-5">
          PŘIDAT KARTU
        </button>
      </div>
      <div className="flex flex-col my-2">
        <label className="text-white">Zadejte číslo karty</label>
        <input
          className="h-10 bg-white text-black contactText p-5"
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
      </div>
      {errors.number && (
        <span className="text-red-500 text-center text-sm contactText">
          {errors.number}
        </span>
      )}
      <div className="flex flex-col my-2">
        <label className="text-white">Pocet penez (Kč)</label>
        <input
          className="h-10 bg-white text-black contactText p-5"
          type="text"
          value={money}
          onChange={(e) => setMoney(e.target.value)}
          required
        />
      </div>
      {errors.money && (
        <span className="text-red-500 text-center text-sm contactText">
          {errors.money}
        </span>
      )}

      <button
        className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? "Přesměrovávám..." : "Zaplatit"}
      </button>
      <button
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={logout}
        disabled={isLoading}
      >
        Odhlásit se
      </button>
    </div>
  );
}

export default AccountPage;
