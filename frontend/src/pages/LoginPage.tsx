import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { loginSchema, type LoginInput } from "@shared/index";

import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import InputTitle from "../components/InputTitle";
import ErrorMessage from "../components/ErrorMessage";

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (location.state?.email) {
      setValue("email", location.state.email);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, setValue]);

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Přihlášení se nezdařilo");
        return;
      }

      localStorage.clear();
      window.location.href = "/moje-karty";
    } catch (err) {
      console.error(err);
      setServerError("Chyba spojení se serverem");
    }
  };

  return (
    <MyForm handleFunction={handleSubmit(onSubmit)}>
      <InputTitle text="Přihlášení" />

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
        <div className="flex justify-between">
          <Inputlabel text="Heslo" />
          <Link
            className="text-black contactText text-[13px] hover:underline"
            to="/forgotPassword"
          >
            Zapomenuté heslo?
          </Link>
        </div>
        <input
          {...register("password")}
          className={`input-field input-black-field ${
            errors.password ? "border-red-500" : "border-transparent"
          }`}
          type="password"
        />
      </div>

      <ErrorMessage
        message={
          errors.email?.message ||
          errors.password?.message ||
          serverError ||
          undefined
        }
      />

      <Link
        to="/register"
        className="text-black contactText text-center hover:underline"
      >
        Nemáte účet? Zaregistrujte se
      </Link>

      <button
        disabled={isSubmitting}
        className="input-button disabled:bg-gray-400 disabled:cursor-not-allowed"
        type="submit"
      >
        {isSubmitting ? "Přihlašování..." : "Přihlásit se"}
      </button>
    </MyForm>
  );
}

export default LoginPage;
