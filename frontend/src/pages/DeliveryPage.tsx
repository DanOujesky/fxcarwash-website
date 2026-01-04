import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import AddressAutocomplete from "../components/AddressAutocomplete";
import Inputlabel from "../components/InputLabel";
import { z } from "zod";
import type { Order } from "../types/Order";
import { useCart } from "../context/CartContext";

interface MapySuggestion {
  name: string;
  location?: string;
  zip?: string;
}
const deliverySchema = z.object({
  phone: z
    .string()
    .min(1, "Telefon je povinný")
    .regex(
      /^(\+?\d{1,3})?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/,
      "Neplatný formát telefonu"
    ),

  address: z.string().min(5, "Ulice a číslo popisné musí mít aspoň 5 znaků"),

  zipCode: z
    .string()
    .min(1, "PSČ je povinné")
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d{5}$/.test(val), "PSČ musí mít 5 číslic"),

  city: z.string().min(2, "Město musí mít aspoň 2 znaky"),

  country: z.string().min(1, "Země je povinná"),
});

function DeliveryPage() {
  const { user, loading } = useAuth();
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    address?: string;
    zipCode?: string;
    city?: string;
    country?: string;
  }>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
    if (cart.length === 0) {
      navigate("/moje-karty");
    }
  }, [loading, user, navigate, cart]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const handleAddressSelect = (fullAddress: MapySuggestion) => {
    setAddress(fullAddress.name);
    setZipCode(fullAddress.zip || "");
    if (fullAddress.location) {
      const locationParts = fullAddress.location
        .split(",")
        .map((part) => part.trim());

      if (locationParts.length > 1) {
        setCity(locationParts[0]);
        setCountry(locationParts[1]);
      }
    }
  };

  const handleTransport: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validation = deliverySchema.safeParse({
      phone,
      address,
      zipCode,
      city,
      country,
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

    const newOrder: Order = {
      id: crypto.randomUUID(),
      items: cart,
      createdAt: new Date(),
      address: address,
      zipCode: zipCode,
      city: city,
      country: country,
      phone: phone,
      price: totalPrice,
    };
    localStorage.setItem("order", JSON.stringify(newOrder));

    navigate("/souhrn", { state: { order: newOrder } });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#252525]">
      <Header account={true} homePage={false} />
      <div className="flex flex-col justify-center items-center body-bg-color pt-15">
        <CartPhaseDisplay delivery={true} phaseNumber={2} />
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color pt-15">
        <form className="my-5 flex flex-col gap-3" onSubmit={handleTransport}>
          <div className="flex flex-1 flex-col">
            <Inputlabel white={true} text="Telefon" />
            <input
              className={`input-field bg-white text-black  border-2 ${
                errors.phone ? "border-red-500" : "border-[#252525]"
              }`}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <AddressAutocomplete
            onAddressSelect={handleAddressSelect}
            initialValue={user.street}
            white={true}
          />
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-1 flex-col">
              <Inputlabel white={true} text="Město" />
              <input
                className={`input-field bg-white text-black  border-2 ${
                  errors.city ? "border-red-500" : "border-[#252525]"
                }`}
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <Inputlabel white={true} text="PSČ" />
              <input
                className={`input-field bg-white text-black  border-2 ${
                  errors.zipCode ? "border-red-500" : "border-[#252525]"
                }`}
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <Inputlabel white={true} text="Stát" />
            <input
              className={`input-field bg-white text-black border-2 ${
                errors.country ? "border-red-500" : "border-[#252525]"
              }`}
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="flex flex-col justify-center items-center body-bg-color p-15">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 p-2 inline-block  rounded-sm mt-5 cursor-pointer"
              disabled={isLoading}
            >
              Pokračovat
            </button>
            <Link
              to="/moje-karty"
              className="bg-transparent border-2 hover:bg-[#1b1b1b] p-2 inline-block  rounded-sm mt-5"
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
