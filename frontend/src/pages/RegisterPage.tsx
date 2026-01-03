import { useState } from "react";
import Inputlabel from "../components/InputLabel";
import InputTitle from "../components/InputTitle";
import MyForm from "../components/MyForm";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

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
});

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    const validation = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
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
