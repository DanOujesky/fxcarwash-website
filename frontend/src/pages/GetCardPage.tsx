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
import { PRODUCT_ID } from "../constants/products";
import Footer from "../components/Footer";

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

  if (loading || !user) return <div className="h-screen bg-black" />;

  const onSubmit = (data: NewCardInput) => {
    const creditValue = Number(data.credit);
    const quantityValue = Number(data.quantity);

    const newOrderItem: OrderItem = {
      id: PRODUCT_ID.NEW_CARD,
      temp_id: crypto.randomUUID(),
      name: "Objednání nové FX karty",
      price: creditValue,
      delivery:
        data.shipping === "cp" || (data.shipping === "op" && !user.address),
      shipping: data.shipping,
      quantity: quantityValue,
      credit: creditValue,
    };

    addToCart(newOrderItem);
    navigate("/kosik");
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] body-bg-color text-white">
      <Header account homePage={false} logo={false} withoutPadding />

      <div className="max-w-[720px] mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-center pb-6">
          Objednání karty
        </h2>

        <form
          className="flex flex-col gap-6 w-full header-color border border-white/10 rounded-xl sm:p-8 py-8 shadow-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <Inputlabel white text="Vyberte způsob doručení" />
            <select
              {...register("shipping")}
              className="input-field input-white-field border-white"
              defaultValue=""
            >
              <option value="" disabled hidden>
                Vyberte...
              </option>
              <option value="cp">Česká pošta (zdarma)</option>
              <option value="op">Osobní převzetí (zdarma)</option>
            </select>
            <ErrorMessage message={errors.shipping?.message} />
          </div>

          {shipping === "op" && (
            <p className="text-white text-sm max-w-md">
              Osobní převzetí na adrese naší provozovny: K černému mostu, 330 12
              Horní Bříza. Jakmile bude Vaše karta připravena, kontaktujeme Vás
              telefonicky/mailem.
            </p>
          )}

          <div className="flex flex-col">
            <Inputlabel white text="Vyberte výši kreditu" />
            <select
              {...register("credit", { valueAsNumber: true })}
              className="input-field input-white-field border-white"
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

          <div className="flex flex-col">
            <Inputlabel white text="Zadejte počet Karet" />
            <Controller
              control={control}
              name="quantity"
              render={({ field }) => (
                <QuantityInput value={field.value} onChange={field.onChange} />
              )}
            />
            <ErrorMessage message={errors.quantity?.message} />
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

export default GetCardPage;
