import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { loginSchema, type LoginInput } from "@shared/index";

import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import InputTitle from "../components/InputTitle";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";
import Footer from "../components/Footer";

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
    <div className="min-h-screen bg-[#252525]">
      <Header takePosition={true} homePage={false} withoutPadding={true} />

      <div className="header-color w-full page-title-height header-margin flex justify-center items-center  flex-col gap-1">
        <h2 className="text-white page-title-size mb-7">fx karty</h2>
        <p className="text-center textUnder mx-5">
          Po registraci/přihlášení nabízíme možnost objednání zvýhodněných
          předplacených karet. Lze objednat novou kartu či opakovaně dobíjet
          stávající karty. FX karty jsou k dispozici v hodnotách od 500 do 10
          000 Kč. V rámci věrnostního programu získáte od nás bonus v podobě
          kreditu navíc.
        </p>
        <p className="text-center textUnder mx-5">
          Seznámit se s našemi obchodními podmínkami můžete zde:{" "}
          <a className="underline">obchodní podmínky</a>
        </p>
      </div>

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
            <button
              type="button"
              className="text-black contactText text-[13px] hover:underline cursor-pointer"
              onClick={() => {
                const currentEmail = getValues("email");
                navigate("/forgotPassword", {
                  state: { email: currentEmail },
                });
              }}
            >
              Zapomenuté heslo?
            </button>
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
      <Footer />
    </div>
  );
}

export default LoginPage;
