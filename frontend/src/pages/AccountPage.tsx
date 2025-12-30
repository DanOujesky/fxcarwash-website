import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import CustomCard from "../components/CustomCard";
import Inputlabel from "../components/InputLabel";
import AddressAutocomplete from "../components/AddressAutocomplete";
import QuantityInput from "../components/QuantityInput";

const paymentSchema = z.object({
  number: z.string().min(1, "Číslo karty je povinné"),
  money: z.coerce
    .number()
    .min(10, "Minimální částka je 10 Kč")
    .max(50000, "Maximální částka je 50 000 Kč"),
});

const orderSchema = z
  .object({
    shipping: z.enum(["cp", "op"] as const, {
      error: "Vyberte způsob doručení",
    }),
    quantity: z.number().min(1).max(100),
    street: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.shipping === "cp") {
      if (!data.street || data.street.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Zadejte prosím kompletní adresu (ulici a číslo)",
          path: ["street"],
        });
        return;
      }
      if (!/\d/.test(data.street)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "V adrese chybí číslo popisné nebo orientační",
          path: ["street"],
        });
      }
    }
  });

interface MapySuggestion {
  name: string;
  location?: string;
  zip?: string;
}

function AccountPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [money, setMoney] = useState("");
  const [number, setNumber] = useState("");
  const [addCard, setAddCard] = useState(false);
  const [shipping, setShipping] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [street, setStreet] = useState("");
  const [errors, setErrors] = useState<{
    number?: string;
    money?: string;
    shipping?: string;
    quanity?: string;
    street?: string;
  }>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const handleCardOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsOrdering(true);

    const validation = orderSchema.safeParse({
      shipping,
      quantity,
      street,
    });

    if (!validation.success) {
      const formattedErrors: typeof errors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof formattedErrors;
        formattedErrors[field] = issue.message;
      });
      setErrors(formattedErrors);
      setIsOrdering(false);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/account/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderData: validation.data, user: user }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setIsOrdering(false);
        setAddCard(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddressSelect = (address: MapySuggestion) => {
    setStreet(address.name);
  };

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
    <div className="p-10 text-white bg-black min-h-screen justify-center align-center flex flex-col">
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
        {addCard && (
          <form className="my-5 flex flex-col gap-3" onSubmit={handleCardOrder}>
            <div className="flex flex-col">
              <Inputlabel text="Vyberte způsob doručení" />
              <select
                onChange={(e) => {
                  setShipping(e.target.value);
                  if (e.target.value === "cp") {
                    setStreet(user.street);
                  }
                }}
                className=" bg-black text-white p-2 cursor-pointer contactText"
                defaultValue=""
              >
                <option value="" disabled hidden></option>
                <option value="cp">Česká pošta (zdarma)</option>
                <option value="op">Osobní převzetí (zdarma)</option>
              </select>
            </div>

            {shipping === "cp" && (
              <AddressAutocomplete
                onAddressSelect={handleAddressSelect}
                initialValue={user.street}
              />
            )}
            {shipping === "op" && <p className="text-black">...........</p>}
            <div>
              <Inputlabel text="Množství" />
              <QuantityInput
                value={quantity}
                onChange={(val) => setQuantity(val)}
              />
            </div>
            {(errors.shipping && (
              <span className="text-red-500 text-center text-sm contactText">
                {errors.shipping}
              </span>
            )) ||
              (errors.street && (
                <span className="text-red-500 text-center text-sm contactText">
                  {errors.street}
                </span>
              )) ||
              (errors.quanity && (
                <span className="text-red-500 text-center text-sm contactText">
                  {errors.quanity}
                </span>
              ))}
            <div className="flex justify-center">
              <button
                className="p-20 bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded transition-all mt-4"
                type="submit"
                disabled={isLoading || isOrdering}
              >
                {isOrdering ? "Objednávám..." : "Objednat"}
              </button>
            </div>
          </form>
        )}
        <button
          className={`${
            addCard
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } p-2 inline-block  rounded-sm mt-5`}
          onClick={() => {
            setAddCard(!addCard);
            if (!addCard) setShipping("");
          }}
        >
          {addCard ? "Zrušit" : "PŘIDAT KARTU"}
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
        disabled={isLoading || isOrdering}
      >
        {isLoading ? "Přesměrovávám..." : "Zaplatit"}
      </button>
      <button
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={logout}
        disabled={isLoading || isOrdering}
      >
        Odhlásit se
      </button>
    </div>
  );
}

export default AccountPage;
