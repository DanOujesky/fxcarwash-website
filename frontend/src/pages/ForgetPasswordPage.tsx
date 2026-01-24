import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";

import { forgetPasswordSchema, type ForgetPasswordInput } from "@shared/index";

import InputTitle from "../components/InputTitle";
import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import InputLink from "../components/InputLink";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";

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
    <div className="min-h-screen bg-[#252525]">
      <Header takePosition={true} homePage={false} withoutPadding={true} />{" "}
      <MyForm handleFunction={handleSubmit(onSubmit)}>
        <InputTitle text="Obnovení hesla" />

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

        <ErrorMessage
          message={errors.email?.message || serverError || undefined}
        />

        <button
          disabled={isSubmitting}
          className="input-button disabled:bg-gray-400 disabled:cursor-not-allowed"
          type="submit"
        >
          {isSubmitting ? "Odesílám..." : "obnovit heslo"}
        </button>

        <InputLink text="Zpět na přihlášení" to="/login" />
      </MyForm>{" "}
    </div>
  );
}

export default ForgetPasswordPage;
