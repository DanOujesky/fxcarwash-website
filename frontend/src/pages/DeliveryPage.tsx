import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deliverySchema, type DeliveryInput } from "@shared/index";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";

import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import AddressAutocomplete from "../components/AddressAutocomplete";
import Inputlabel from "../components/InputLabel";
import ErrorMessage from "../components/ErrorMessage";
import Footer from "../components/Footer";

import type { Order } from "../types/Order";

interface MapySuggestion {
  name: string;
  location?: string;
  zip?: string;
}

function DeliveryPage() {
  const { user, loading } = useAuth();
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();

  const savedOrderString = localStorage.getItem("order");
  const savedOrder = savedOrderString ? JSON.parse(savedOrderString) : null;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DeliveryInput>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      phone: user?.phone || "",
      address: user?.address || "",
      zipCode: user?.zipCode || "",
      city: user?.city || "",
      country: user?.country || "",
      isCompany: false,
    },
  });

  const isCompany = watch("isCompany");

  useEffect(() => {
    if (!loading && !user) navigate("/", { replace: true });
    if (!loading && cart.length === 0) navigate("/moje-karty");
  }, [loading, user, navigate, cart]);

  if (loading || !user) return <div className="h-screen bg-black" />;

  const handleAddressSelect = (fullAddress: MapySuggestion) => {
    setValue("address", fullAddress.name);
    setValue("zipCode", fullAddress.zip || "");

    if (fullAddress.location) {
      const parts = fullAddress.location.split(",").map((p) => p.trim());
      if (parts.length > 1) {
        setValue("city", parts[0]);
        setValue("country", parts[1]);
      }
    }
  };

  const onSubmit = (data: DeliveryInput) => {
    const newOrder: Order = {
      ...savedOrder,
      id: crypto.randomUUID(),
      items: cart,
      price: totalPrice,
      email: user.email,
      ...data,
    };

    localStorage.setItem("order", JSON.stringify(newOrder));
    navigate("/souhrn", { state: { order: newOrder } });
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] bg-[#252525] text-white">
      <Header account homePage={false} logo={false} withoutPadding />

      <div className="flex justify-center pt-12">
        <CartPhaseDisplay delivery phaseNumber={2} />
      </div>

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-12 pb-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full bg-[#1b1b1b] border border-white/10 rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-lg font-semibold">Doručovací údaje</h2>

          {/* Telefon */}
          <div className="flex flex-col">
            <Inputlabel white text="Telefon" />
            <input
              {...register("phone")}
              className={`input-field input-white-field ${
                errors.phone ? "border-red-500" : "border-transparent"
              }`}
              type="tel"
            />
            <ErrorMessage message={errors.phone?.message} />
          </div>

          {/* Adresa */}
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <AddressAutocomplete
                onAddressSelect={(addr) => {
                  handleAddressSelect(addr);
                  onChange(addr.name);
                }}
                onChange={onChange}
                initialValue={value}
                error={errors.address}
                white
              />
            )}
          />
          <ErrorMessage message={errors.address?.message} />

          {/* Město a PSČ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <Inputlabel white text="Město" />
              <input
                {...register("city")}
                className={`input-field input-white-field ${
                  errors.city ? "border-red-500" : "border-transparent"
                }`}
              />
              <ErrorMessage message={errors.city?.message} />
            </div>

            <div className="flex flex-col">
              <Inputlabel white text="PSČ" />
              <input
                {...register("zipCode")}
                className={`input-field input-white-field ${
                  errors.zipCode ? "border-red-500" : "border-transparent"
                }`}
              />
              <ErrorMessage message={errors.zipCode?.message} />
            </div>
          </div>

          {/* Stát */}
          <div className="flex flex-col">
            <Inputlabel white text="Stát" />
            <input
              {...register("country")}
              className={`input-field input-white-field ${
                errors.country ? "border-red-500" : "border-transparent"
              }`}
            />
            <ErrorMessage message={errors.country?.message} />
          </div>

          {/* Checkbox firma */}
          <label className="flex items-center gap-3 pt-4 cursor-pointer">
            <input
              className="w-6 h-6 accent-green-500 cursor-pointer"
              type="checkbox"
              {...register("isCompany")}
            />
            Nakoupit na firmu
          </label>

          {/* Firemní údaje */}
          {isCompany && (
            <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold">Firemní údaje</h3>

              <div className="flex flex-col">
                <Inputlabel white text="Název firmy" />
                <input
                  {...register("companyName")}
                  className="input-field input-white-field border-white"
                />
                <ErrorMessage message={errors.companyName?.message} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <Inputlabel white text="IČO" />
                  <input
                    {...register("companyICO")}
                    className="input-field input-white-field border-white"
                  />
                  <ErrorMessage message={errors.companyICO?.message} />
                </div>

                <div className="flex flex-col">
                  <Inputlabel white text="DIČ" />
                  <input
                    {...register("companyDIC")}
                    className="input-field input-white-field border-white"
                  />
                  <ErrorMessage message={errors.companyDIC?.message} />
                </div>
              </div>

              <div className="flex flex-col">
                <Inputlabel white text="Adresa firmy" />
                <input
                  {...register("companyAddress")}
                  className="input-field input-white-field border-white"
                />
                <ErrorMessage message={errors.companyAddress?.message} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <Inputlabel white text="Město" />
                  <input
                    {...register("companyCity")}
                    className="input-field input-white-field border-white"
                  />
                  <ErrorMessage message={errors.companyCity?.message} />
                </div>

                <div className="flex flex-col">
                  <Inputlabel white text="PSČ" />
                  <input
                    {...register("companyZipCode")}
                    className="input-field input-white-field border-white"
                  />
                  <ErrorMessage message={errors.companyZipCode?.message} />
                </div>
              </div>
            </div>
          )}

          {/* Tlačítka */}
          <div className="flex flex-col  gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition disabled:bg-gray-500"
            >
              {isSubmitting ? "Zpracovávám..." : "Pokračovat"}
            </button>

            <Link
              to="/kosik"
              className="flex-1 border border-white/20 text-white py-3 rounded-lg text-center hover:bg-white/5 transition"
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

export default DeliveryPage;
