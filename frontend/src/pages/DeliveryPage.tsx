import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import { deliverySchema, type DeliveryInput } from "@shared/index";
import type { Order } from "../types/Order";

import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import AddressAutocomplete from "../components/AddressAutocomplete";
import Inputlabel from "../components/InputLabel";
import ErrorMessage from "../components/ErrorMessage";

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

  let savedOrder = null;
  try {
    savedOrder = savedOrderString ? JSON.parse(savedOrderString) : null;
  } catch (e) {
    console.error("Chyba při parsování objednávky:", e);
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DeliveryInput>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      phone: savedOrder?.phone || "",
      address: savedOrder?.address || "",
      zipCode: savedOrder?.zipCode || "",
      city: savedOrder?.city || "",
      country: savedOrder?.country || "",
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
    if (!loading && cart.length === 0) {
      navigate("/moje-karty");
    }
  }, [loading, user, navigate, cart]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const handleAddressSelect = (fullAddress: MapySuggestion) => {
    setValue("address", fullAddress.name, { shouldValidate: true });
    setValue("zipCode", fullAddress.zip || "", { shouldValidate: true });

    if (fullAddress.location) {
      const locationParts = fullAddress.location
        .split(",")
        .map((part) => part.trim());
      if (locationParts.length > 1) {
        setValue("city", locationParts[0], { shouldValidate: true });
        setValue("country", locationParts[1], { shouldValidate: true });
      }
    }
  };

  const onSubmit = (data: DeliveryInput) => {
    const newOrder: Order = {
      id: crypto.randomUUID(),
      items: cart,
      address: data.address,
      zipCode: data.zipCode,
      city: data.city,
      country: data.country,
      phone: data.phone,
      price: totalPrice,
      email: user.email,
    };

    localStorage.setItem("order", JSON.stringify(newOrder));
    navigate("/souhrn", { state: { order: newOrder } });
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] bg-[#252525]">
      <Header
        account={true}
        homePage={false}
        logo={false}
        withoutPadding={true}
      />

      <div className="flex flex-col justify-center items-center body-bg-color pt-15">
        <CartPhaseDisplay delivery={true} phaseNumber={2} />
      </div>

      <div className="flex flex-col justify-center items-center body-bg-color pt-15">
        <form
          className="my-5 flex flex-col gap-3 w-full max-w-md px-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <Inputlabel white={true} text="Telefon" />
            <input
              {...register("phone")}
              className={`input-field input-white-field ${
                errors.phone ? "border-red-500" : "border-transparent"
              }`}
              type="tel"
            />
            <ErrorMessage marginOn={true} message={errors.phone?.message} />
          </div>

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <AddressAutocomplete
                onAddressSelect={(fullAddress) => {
                  handleAddressSelect(fullAddress);
                  onChange(fullAddress.name);
                }}
                onChange={onChange}
                initialValue={value}
                error={errors.address}
                white={true}
              />
            )}
          />
          <ErrorMessage message={errors.address?.message} />
          <input type="hidden" {...register("address")} />

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col">
              <Inputlabel white={true} text="Město" />
              <input
                {...register("city")}
                className={`input-field input-white-field ${
                  errors.city ? "border-red-500" : "border-transparent"
                }`}
                type="text"
              />
            </div>
            <div className="flex flex-col">
              <Inputlabel white={true} text="PSČ" />
              <input
                {...register("zipCode")}
                className={`input-field input-white-field ${
                  errors.zipCode ? "border-red-500" : "border-transparent"
                }`}
                type="text"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {errors.city?.message ? (
              <ErrorMessage message={errors.city.message} />
            ) : (
              <div></div>
            )}

            <ErrorMessage message={errors.zipCode?.message} />
          </div>

          <div className="flex flex-col">
            <Inputlabel white={true} text="Stát" />
            <input
              {...register("country")}
              className={`input-field input-white-field ${
                errors.country ? "border-red-500" : "border-transparent"
              }`}
              type="text"
            />
            <ErrorMessage marginOn={true} message={errors.country?.message} />
          </div>

          <div className="flex flex-col justify-center items-center gap-4 mt-5">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold p-3 w-full rounded-sm transition-colors disabled:bg-gray-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Zpracovávám..." : "Pokračovat"}
            </button>
            <Link
              to="/moje-karty"
              className="text-white border-2 border-white hover:bg-[#1b1b1b] p-2 w-full text-center rounded-sm transition-colors"
            >
              Zpět k nákupu
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeliveryPage;
