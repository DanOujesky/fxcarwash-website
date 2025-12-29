import { useState } from "react";
import Inputlabel from "../components/InputLabel";
import InputTitle from "../components/InputTitle";
import MyForm from "../components/MyForm";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import AddressAutocomplete from "../components/AddressAutocomplete";

const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "Jméno musí mít aspoň 2 znaky")
    .max(50, "Jméno je příliš dlouhé")
    .trim()
    .transform(
      (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    ),

  lastName: z
    .string()
    .min(2, "Příjmení musí mít aspoň 2 znaky")
    .max(50, "Příjmení je příliš dlouhé")
    .trim()
    .transform(
      (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    ),

  email: z.string().email("Zadejte platnou e-mailovou adresu"),

  password: z
    .string()
    .min(8, "Heslo musí mít alespoň 8 znaků")
    .max(50, "Heslo je příliš dlouhé")
    .regex(/[0-9]/, "Heslo musí obsahovat alespoň jedno číslo"),

  phone: z
    .string()
    .regex(
      /^(\+420|\+421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
      "Zadejte platné tel. číslo (+420 123 456 789)"
    ),

  street: z
    .string()
    .min(3, "Ulice je příliš krátká")
    .refine((val) => /\d/.test(val), {
      message: "Nezapomeňte na číslo popisné nebo orientační",
    }),

  city: z.string().min(2, "Zadejte platné město"),

  zipCode: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^[0-9]{5}$/, "PSČ musí mít 5 číslic")),

  country: z.string().min(2, "Vyberte zemi"),
});

interface MapySuggestion {
  name: string;
  location?: string;
  zip?: string;
}

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddressSelect = (address: MapySuggestion) => {
    setStreet(address.name);
    setZipCode(address.zip || "");
    if (address.location) {
      const locationParts = address.location
        .split(",")
        .map((part) => part.trim());

      if (locationParts.length > 1) {
        setCity(locationParts[0]);
        setCountry(locationParts[1]);
      }
    }
  };

  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    const validation = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      phone,
      street,
      city,
      zipCode,
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
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setResponse(data.error);
        return;
      } else {
        navigate("/login", { state: { email: email } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MyForm handleFunction={handleRegister}>
      <InputTitle text="Registrace účtu" />
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
        <div className="flex flex-col">
          <Inputlabel text="Jméno" />
          <input
            className={`input-field border-2 ${
              errors.firstName ? "border-red-500" : ""
            }`}
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <Inputlabel text="Příjmení" />
          <input
            className={`input-field border-2 ${
              errors.lastName ? "border-red-500" : ""
            }`}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <Inputlabel text="E-mail" />
        <input
          className={`input-field border-2 ${
            errors.email ? "border-red-500" : ""
          }`}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <Inputlabel text="Heslo" />
        <input
          className={`input-field border-2 ${
            errors.password ? "border-red-500" : ""
          }`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <Inputlabel text="Telefon" />
        <input
          className={`input-field border-2 ${
            errors.phone ? "border-red-500" : ""
          }`}
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <AddressAutocomplete
        onAddressSelect={handleAddressSelect}
        error={errors.street ? true : false}
      />

      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
        <div className="flex flex-col">
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

      <div className="flex items-center justify-center gap-5 text-sm text-gray-400 w-full">
        <input
          type="checkbox"
          id="gdpr"
          className="w-7 h-7 accent-green-500 cursor-pointer"
          required
        />
        <label className="text-black leading-none cursor-pointer flex-1 contactText">
          Souhlasím se zpracováním osobních údajů
        </label>
      </div>
      {(errors.firstName && (
        <span className="text-red-500 text-center text-sm contactText">
          {errors.firstName}
        </span>
      )) ||
        (errors.lastName && (
          <span className="text-red-500 text-center text-sm contactText">
            {errors.lastName}
          </span>
        )) ||
        (errors.email && (
          <span className="text-red-500 text-center text-sm contactText">
            {errors.email}
          </span>
        )) ||
        (errors.password && (
          <span className="text-red-500 text-center text-sm contactText">
            {errors.password}
          </span>
        )) ||
        (errors.phone && (
          <span className="text-red-500 text-center text-sm contactText">
            {errors.phone}
          </span>
        )) ||
        (errors.street && (
          <span className="text-red-500 text-center text-sm contactText">
            {errors.street}
          </span>
        )) ||
        (errors.city && (
          <span className="text-red-500 text-center text-sm contactText">
            {errors.city}
          </span>
        )) ||
        (errors.zipCode && (
          <span className="text-red-500 text-center text-sm contactText">
            {errors.zipCode}
          </span>
        )) ||
        (errors.country && (
          <span className="text-red-500 text-center text-sm contactText">
            {errors.country}
          </span>
        ))}
      {response && (
        <span className="text-red-500 text-center text-sm contactText">
          {response}
        </span>
      )}
      <Link
        to="/login"
        className="text-black contactText text-center hover:underline"
      >
        Už jste zaregistrovaní? Přihlaste se
      </Link>
      <button
        className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded transition-all"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Registrování..." : "Registrace"}
      </button>
    </MyForm>
  );
}

export default RegisterPage;
