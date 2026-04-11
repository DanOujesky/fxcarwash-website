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
import Footer from "../components/Footer";

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
    if (!loading && !user) navigate("/", { replace: true });
    if (user && user.cards.length < 1)
      navigate("/moje-karty", { replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) return <div className="h-screen bg-black" />;

  const onSubmit = (data: AddCreditInput) => {
    const creditValue = Number(data.credit);

    const orderItem: OrderItem = {
      id: PRODUCT_ID.ADD_CREDIT,
      temp_id: crypto.randomUUID(),
      name: "Dobítí kreditu na FX kartu",
      price: creditValue,
      delivery: false,
      cardNumber: data.cardNumber,
      credit: creditValue,
    };

    addToCart(orderItem);
    navigate("/kosik");
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] body-bg-color text-white">
      <Header account homePage={false} logo={false} withoutPadding />

      <div className="max-w-[720px] mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-center pb-6">
          Dobití kreditu
        </h2>

        <form
          className="flex flex-col gap-6 w-full header-color border border-white/10 rounded-xl sm:p-8 py-8 px-4 shadow-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <Inputlabel white text="Vyberte Kartu" />
            <div className="flex flex-col gap-2">
              {user.cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() =>
                    setValue("cardNumber", card.number, {
                      shouldValidate: true,
                    })
                  }
                >
                  <CustomCard
                    hover
                    isSelected={selectedCardNumber === card.number}
                    credit={card.credit}
                    number={card.number}
                  />
                </div>
              ))}
              <input type="hidden" {...register("cardNumber")} />
            </div>
            <ErrorMessage message={errors.cardNumber?.message} />
          </div>

          <div className="flex flex-col">
            <Inputlabel white text="Vyberte výši kreditu" />
            <select
              {...register("credit", { valueAsNumber: true })}
              className="input-field input-white-field border-white "
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
            <ErrorMessage message={errors.credit?.message} />
          </div>

          <div className="flex flex-col self-center w-55 sm:w-80  gap-4 pt-6">
            <button
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition disabled:bg-gray-500"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Přidávám..." : "Přidat do košíku"}
            </button>
            <Link
              className="flex-1 border border-white/20 text-white py-3 rounded-lg text-center hover:bg-white/5 transition"
              to="/moje-karty"
            >
              Zpět
            </Link>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default GetCreditPage;
