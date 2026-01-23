import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import { addCreditSchema, type AddCreditInput } from "@shared/index";

import CustomCard from "../components/CustomCard";
import Inputlabel from "../components/InputLabel";
import Header from "../components/Header";
import ErrorMessage from "../components/ErrorMessage";
import type { OrderItem } from "../types/Order";
import { PRODUCT_ID } from "../constants/products";

function GetCreditPage() {
  const { user, loading } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddCreditInput>({
    resolver: zodResolver(addCreditSchema),
    defaultValues: {
      cardNumber: "",
      credit: 500,
    },
  });

  const selectedCardNumber = watch("cardNumber");

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

  const onSubmit = (data: AddCreditInput) => {
    const creditValue = Number(data.credit);

    const orderItem: OrderItem = {
      id: PRODUCT_ID.ADD_CREDIT,
      temp_id: crypto.randomUUID(),
      name: "Dobítí kreditu na předplacenou FX kartu",
      price: creditValue,
      delivery: false,
      cardNumber: data.cardNumber,
      credit: creditValue * (1 + user.discount / 100),
    };

    addToCart(orderItem);
    navigate("/kosik");
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] bg-[#252525]">
      <Header
        account={true}
        homePage={false}
        logo={false}
        withoutPadding={true}
      />

      <div className="flex flex-col justify-center items-center body-bg-color pt-15 text-white">
        <h2 className="text-2xl underline">Dobití kreditu</h2>
      </div>

      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        <form
          className="my-5 flex flex-col gap-3 w-full md:w-120"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <Inputlabel white={true} text="Vyberte Kartu" />
            <div className="">
              {user.cards.map((card) => (
                <div
                  className="my-2 cursor-pointer"
                  key={card.id}
                  onClick={() =>
                    setValue("cardNumber", card.number, {
                      shouldValidate: true,
                    })
                  }
                >
                  <CustomCard
                    hover={true}
                    isSelected={selectedCardNumber === card.number}
                    credit={card.credit}
                    number={card.number}
                  />
                </div>
              ))}
              <input type="hidden" {...register("cardNumber")} />
            </div>
          </div>

          <div className="flex flex-col">
            <Inputlabel white={true} text="Vyberte výši kreditu" />
            <select
              {...register("credit", { valueAsNumber: true })}
              className="bg-white text-black p-2 cursor-pointer contactText outline-none rounded-sm"
            >
              {[
                500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000, 8000,
                9000, 10000,
              ].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 min-h-[20px] text-center">
            <ErrorMessage
              message={
                errors.cardNumber?.message ||
                errors.credit?.message ||
                undefined
              }
            />
          </div>

          <div className="flex flex-col justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 p-2 inline-block rounded-sm mt-5 font-bold disabled:bg-gray-500"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "přidávám..." : "Přidat do košíku"}
            </button>
            <Link
              className="bg-transparent border-2 border-white text-white hover:bg-[#1b1b1b] p-2 inline-block rounded-sm mt-5 text-center transition-colors"
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
