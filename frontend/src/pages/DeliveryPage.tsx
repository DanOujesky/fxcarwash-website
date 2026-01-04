import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import AddressAutocomplete from "../components/AddressAutocomplete";
import Inputlabel from "../components/InputLabel";
import { z } from "zod";

interface MapySuggestion {
  name: string;
  location?: string;
  zip?: string;
}
const deliverySchema = z.object({
  email: z
    .string()
    .min(1, "E-mail je povinný")
    .email("Neplatný formát e-mailu"),

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
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    address?: string;
    zipCode?: string;
    city?: string;
    country?: string;
  }>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

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
      email,
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
  };

  return (
    <div className="min-h-screen bg-[#252525]">
      <Header account={true} homePage={false} />
      <div className="flex flex-col justify-center items-center body-bg-color pt-15">
        <CartPhaseDisplay delivery={true} phaseNumber={2} />
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color pt-15">
        <form className="my-5 flex flex-col gap-3" onSubmit={handleTransport}>
          <div className="">
            <AddressAutocomplete
              onAddressSelect={handleAddressSelect}
              initialValue={user.street}
            />
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-1 flex-col">
                <Inputlabel text="Město" />
                <input
                  className={`input-field border-2 ${
                    errors.city ? "border-red-500" : ""
                  }`}
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <Inputlabel text="PSČ" />
                <input
                  className={`input-field border-2 ${
                    errors.zipCode ? "border-red-500" : ""
                  }`}
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <Inputlabel text="Stát" />
              <input
                className={`input-field border-2 ${
                  errors.country ? "border-red-500" : ""
                }`}
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeliveryPage;
