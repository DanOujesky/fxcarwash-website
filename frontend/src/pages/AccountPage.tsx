import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import CustomCard from "../components/CustomCard";
import Inputlabel from "../components/InputLabel";
import AddressAutocomplete from "../components/AddressAutocomplete";

const paymentSchema = z
  .object({
    cardNumber: z.string().min(1, "Číslo karty je povinné"),
    credit: z.coerce
      .number()
      .min(10, "Minimální částka je 10 Kč")
      .max(50000, "Maximální částka je 50 000 Kč"),
    action: z.enum(["createCard", "addCredit"], {
      error: "neplatná akce",
    }),
    shipping: z.string().optional(),
    street: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.action === "createCard" &&
      !["cp", "op"].includes(data.shipping || "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Zvolte platný způsob dopravy",
        path: ["shipping"],
      });
    }
  });

const orderSchema = z
  .object({
    shipping: z.enum(["cp", "op"], {
      error: "Vyberte způsob doručení",
    }),
    street: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    credit: z.coerce
      .number("Kredit musí být číslo")
      .min(10, "Minimální částka je 10 Kč")
      .max(50000, "Maximální částka je 50 000 Kč"),
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
  const [number, setNumber] = useState("");
  const [money, setMoney] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [credit, setCredit] = useState("");
  const [prize, setPrize] = useState("0");
  const [addCard, setAddCard] = useState(false);
  const [shipping, setShipping] = useState("");
  const [street, setStreet] = useState("");
  const [errors, setErrors] = useState<{
    shipping?: string;
    quantity?: string;
    street?: string;
    credit?: string;
    response?: string;
  }>({});
  const [selectedCardId, setSelectedCardId] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }
  const clearCreditForm = () => {
    setSelectedCardId("");
    setNumber("");
    setMoney("");
    setErrors({ credit: "" });
  };
  const handleCardOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsOrdering(true);

    const validation = orderSchema.safeParse({
      shipping,
      street,
      credit,
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/get-card`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const cardData = await response.json();

      if (!response.ok) {
        setErrors({ quantity: cardData.error || "Něco se nepovedlo" });
        return;
      }
      const cardNumber = cardData.cardNumber;
      const action = "createCard";

      await handlePayment({
        cardNumber,
        credit,
        action,
        shipping,
        street,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsOrdering(false);
    }
  };

  const handleAddressSelect = (address: MapySuggestion) => {
    setStreet(address.name);
  };

  const handlePayment = async ({
    cardNumber,
    credit,
    action,
    shipping,
    street,
  }: {
    cardNumber: string;
    credit: string;
    action: string;
    shipping?: string;
    street?: string;
    quantity?: number;
  }) => {
    const validation = paymentSchema.safeParse({
      cardNumber,
      credit,
      action,
      shipping,
      street,
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
    if (action === "createCard") {
      setIsOrdering(true);
    } else if (action === "addCredit") {
      setIsLoading(true);
    }

    setErrors({});

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
        setErrors({ response: data.error || "Karta nebyla nalezena" });
        return;
      }
      if (!res.ok) {
        setErrors({ response: data.error || "Něco se nepovedlo" });
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
    <div className="p-10 text-white bg-black min-h-screen justify-center align-center flex flex-col gap-5">
      <h1 className="text-2xl font-bold mb-4 text-center">Můj Účet</h1>

      <div className="bg-gray-100 p-6 ">
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
          <span className="font-medium">Město:</span> {user.city}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">PSČ:</span> {user.zipCode}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Stát:</span> {user.country}
        </p>
      </div>
      <div className="bg-gray-100 p-6 ">
        <h2 className="text-lg text-black font-semibold mb-2">Karty</h2>
        {user.cards.length > 0 ? (
          user.cards.map((card) => (
            <div
              className="cursor-pointer hover:bg-gray-300"
              key={card.id}
              onClick={() => {
                setSelectedCardId(card.id);
                setNumber(card.number);
                setAddCard(false);
                if (!addCard) setShipping("");
              }}
            >
              <CustomCard
                credit={card.credit}
                number={card.number}
                isSelected={selectedCardId === card.id}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-700">Nemáte žádnou kartu</p>
        )}
        {selectedCardId && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePayment({
                cardNumber: number,
                credit: money,
                action: "addCredit",
              });
            }}
            className="flex flex-col gap-5"
          >
            <h2 className="text-lg text-black font-semibold mb-2 text-center">
              Dobíjení kreditu
            </h2>
            <div className="flex flex-col">
              <Inputlabel text="Číslo karty" />
              <input
                className=" bg-black text-white contactText p-2"
                type="text"
                value={number}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <Inputlabel text="Kredit" />
              <input
                className=" bg-black text-white contactText p-2"
                type="text"
                value={money}
                onChange={(e) => {
                  setMoney(e.target.value);
                }}
              />
            </div>
            {errors.credit && (
              <span className="text-red-500 text-center text-sm contactText">
                {errors.credit}
              </span>
            )}
            <div className="flex justify-center">
              <button
                className="p-20 bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded transition-all my-4"
                type="submit"
                disabled={isLoading || isOrdering}
              >
                {isLoading ? "Přesměrovávám..." : "Zaplatit"}
              </button>
            </div>
            <div className="flex">
              <button
                className="p-2 bg-red-500 hover:bg-red-600 p-2 inline-block  rounded-sm mt-5"
                disabled={isLoading || isOrdering}
                onClick={clearCreditForm}
              >
                Zrušit
              </button>
            </div>
          </form>
        )}
        {addCard && (
          <form className="my-5 flex flex-col gap-3" onSubmit={handleCardOrder}>
            <h2 className="text-lg text-black font-semibold mb-2 text-center">
              Objednání karty
            </h2>
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
            {shipping === "op" && (
              <p className="text-black">
                Osobní převzetí na adrese naší provozovny: K černému mostu, 330
                12 Horní Bříza. Jakmile bude Vaše karta připravena, kontaktujeme
                Vás telefonicky/mailem.
              </p>
            )}
            <div className="flex flex-col">
              <Inputlabel text="Zadejte výši Kreditu" />
              <input
                className=" bg-black text-white contactText p-2"
                type="text"
                value={credit}
                onChange={(e) => {
                  setCredit(e.target.value);
                  setPrize(e.target.value);
                }}
              />
            </div>
            <div className="text-black contactText">
              Vaše Cena: <span className="">{prize} Kč</span>
            </div>
            <div className="text-black contactText">
              Nahraný Kredit: <span className="">{Number(prize) * 1.1} Kč</span>
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
              (errors.quantity && (
                <span className="text-red-500 text-center text-sm contactText">
                  {errors.quantity}
                </span>
              )) ||
              (errors.credit && (
                <span className="text-red-500 text-center text-sm contactText">
                  {errors.credit}
                </span>
              )) ||
              (errors.response && (
                <span className="text-red-500 text-center text-sm contactText">
                  {errors.credit}
                </span>
              ))}

            <div className="flex justify-center">
              <button
                className="p-20 bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded transition-all my-4"
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
            clearCreditForm();
            if (!addCard) setShipping("");
          }}
        >
          {addCard ? "Zrušit" : "PŘIDAT KARTU"}
        </button>
      </div>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={logout}
        disabled={isLoading || isOrdering}
      >
        Odhlásit se
      </button>
    </div>
  );
}

export default AccountPage;
