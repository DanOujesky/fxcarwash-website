import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import { newCardSchema, type NewCardInput } from "@shared/index";

import Inputlabel from "../components/InputLabel";
import Header from "../components/Header";
import QuantityInput from "../components/QuantityInput";
import ErrorMessage from "../components/ErrorMessage";
import type { OrderItem } from "../types/Order";

function GetCardPage() {
  const { user, loading } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewCardInput>({
    resolver: zodResolver(newCardSchema),
    defaultValues: {
      shipping: undefined,
      quantity: 1,
      credit: 500,
    },
  });

  const shipping = watch("shipping");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const onSubmit = (data: NewCardInput) => {
    const newOrderItem: OrderItem = {
      id: crypto.randomUUID(),
      name: "Objednání nové FX karty",
      prize: data.credit,
      delivery: data.shipping === "cp",
      shipping: data.shipping,
      quantity: data.quantity,
      credit: data.credit * (1 + user.discount / 100),
    };

    addToCart(newOrderItem);
    navigate("/kosik");
  };

  return (
    <div className="min-h-screen bg-[#252525]">
      <Header account={true} homePage={false} logo={false} />

      <div className="flex flex-col justify-center items-center body-bg-color pt-15">
        <h2 className="text-2xl underline text-white">Objednání karty</h2>
      </div>

      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        <form
          className="my-5 flex flex-col gap-3 w-full md:w-120"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <Inputlabel white={true} text="Vyberte způsob doručení" />
            <select
              {...register("shipping")}
              className="bg-white text-black p-2 cursor-pointer contactText rounded-sm outline-none"
              defaultValue=""
            >
              <option value="" disabled hidden>
                Vyberte...
              </option>
              <option value="cp">Česká pošta (zdarma)</option>
              <option value="op">Osobní převzetí (zdarma)</option>
            </select>
          </div>

          {shipping === "op" && (
            <p className="text-white text-sm max-w-md">
              Osobní převzetí na adrese naší provozovny: K černému mostu, 330 12
              Horní Bříza. Jakmile bude Vaše karta připravena, kontaktujeme Vás
              telefonicky/mailem.
            </p>
          )}

          <div className="flex flex-col">
            <Inputlabel white={true} text="Vyberte výši kreditu" />
            <select
              {...register("credit")}
              className="bg-white text-black p-2 cursor-pointer contactText rounded-sm outline-none"
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

          <div className="flex flex-col">
            <Inputlabel white={true} text="Zadejte počet Karet" />
            <Controller
              control={control}
              name="quantity"
              render={({ field }) => (
                <QuantityInput value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="flex flex-col gap-1 min-h-[24px] text-center">
            <ErrorMessage
              message={
                errors.shipping?.message ||
                errors.quantity?.message ||
                errors.credit?.message ||
                undefined
              }
            />
          </div>

          <div className="flex flex-col justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 p-2 inline-block rounded-sm mt-5 font-bold disabled:bg-gray-500 transition-colors"
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

export default GetCardPage;
