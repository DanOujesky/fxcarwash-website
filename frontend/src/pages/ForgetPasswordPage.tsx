import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { forgetPasswordSchema, type ForgetPasswordInput } from "@shared/index";

import Inputlabel from "../components/InputLabel";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ForgetPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordInput>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (location.state?.email) {
      setValue("email", location.state.email);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, setValue]);

  const onSubmit = async (data: ForgetPasswordInput) => {
    setServerError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/email-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Něco se nepovedlo");
        return;
      }

      if (result.exists === false) {
        setServerError("Tento e-mail není registrován");
        return;
      }

      navigate("/resetPassword", {
        state: { email: result.email, message: result.message },
      });
    } catch (err) {
      console.error(err);
      setServerError("Chyba serveru. Zkuste to prosím později.");
    }
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] body-bg-color text-white">
      <Header account homePage={false} logo={false} withoutPadding />

      <div className="max-w-[520px] mx-auto px-4 sm:px-6 pt-16 pb-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full header-color border border-white/10 rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-center">Obnovení hesla</h2>

          <div className="flex flex-col">
            <Inputlabel white text="E-mail" />
            <input
              {...register("email")}
              type="email"
              className={`input-field input-white-field ${
                errors.email ? "border-red-500" : "border-transparent"
              }`}
            />
          </div>

          <ErrorMessage
            message={errors.email?.message || serverError || undefined}
          />

          <div className="flex flex-col gap-4 pt-6">
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition disabled:bg-gray-500"
            >
              {isSubmitting ? "Odesílám..." : "Obnovit heslo"}
            </button>

            <Link
              to="/login"
              className="flex-1 border border-white/20 text-white py-3 rounded-lg text-center hover:bg-white/5 transition"
            >
              Zpět na přihlášení
            </Link>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default ForgetPasswordPage;
