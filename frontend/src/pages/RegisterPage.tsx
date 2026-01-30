import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

import { registerSchema, type RegisterInput } from "@shared/index";

import Inputlabel from "../components/InputLabel";
import InputTitle from "../components/InputTitle";
import MyForm from "../components/MyForm";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";
import Footer from "../components/Footer";

function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Registrace se nezdařila");
        return;
      }

      navigate("/login", { state: { email: data.email } });
    } catch (err) {
      console.error("Chyba při registraci:", err);
      setServerError("Nepodařilo se navázat spojení se serverem");
    }
  };

  return (
    <div className="min-h-screen bg-[#252525]">
      <Header takePosition={true} homePage={false} withoutPadding={true} />{" "}
      <MyForm handleFunction={handleSubmit(onSubmit)}>
        <InputTitle text="Registrace účtu" />

        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
          <div className="flex flex-col">
            <Inputlabel text="Jméno" />
            <input
              {...register("firstName")}
              className={`input-field input-black-field ${
                errors.firstName ? "border-red-500" : "border-transparent"
              }`}
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <Inputlabel text="Příjmení" />
            <input
              {...register("lastName")}
              className={`input-field input-black-field ${
                errors.lastName ? "border-red-500" : "border-transparent"
              }`}
              type="text"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <Inputlabel text="E-mail" />
          <input
            {...register("email")}
            className={`input-field input-black-field ${
              errors.email ? "border-red-500" : "border-transparent"
            }`}
            type="email"
          />
        </div>

        <div className="flex flex-col">
          <Inputlabel text="Heslo" />
          <input
            {...register("password")}
            className={`input-field input-black-field ${
              errors.password ? "border-red-500" : "border-transparent"
            }`}
            type="password"
          />
        </div>

        <div className="flex items-center justify-center gap-5 text-sm text-gray-400 w-full">
          <input
            type="checkbox"
            id="gdpr"
            className="w-7 h-7 accent-green-500 cursor-pointer"
            checked={isAgreed}
            onChange={() => setIsAgreed(!isAgreed)}
          />
          <label
            htmlFor="gdpr"
            className="text-black leading-none flex-1 contactText cursor-pointer"
          >
            Souhlasím se zpracováním osobních údajů
          </label>
        </div>

        <div className="flex flex-col gap-1 min-h-[20px]">
          <ErrorMessage
            message={
              errors.firstName?.message ||
              errors.lastName?.message ||
              errors.email?.message ||
              errors.password?.message ||
              serverError ||
              undefined
            }
          />
        </div>

        <Link
          to="/login"
          className="text-black contactText text-center hover:underline"
        >
          Už jste zaregistrovaní? Přihlašte se
        </Link>

        <button
          className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting || !isAgreed}
        >
          {isSubmitting ? "Registrování..." : "Registrace"}
        </button>
      </MyForm>
      <Footer />
    </div>
  );
}

export default RegisterPage;
