import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";

import { newPasswordSchema, type NewPasswordInput } from "@shared/index";

import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import InputTitle from "../components/InputTitle";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";
import Footer from "../components/Footer";

function NewPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const code = location.state?.code || "";

  useEffect(() => {
    if (!email || !code) {
      navigate("/login");
    }
  }, [email, code, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      email,
      code,
      newPassword: "",
    },
  });

  const onSubmit = async (data: NewPasswordInput) => {
    setServerError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/newPassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Nepodařilo se změnit heslo");
        return;
      }

      navigate("/login", { state: { email: data.email } });
    } catch (err) {
      console.error(err);
      setServerError("Chyba spojení se serverem");
    }
  };

  return (
    <div className="min-h-screen bg-[#252525]">
      <Header takePosition={true} homePage={false} withoutPadding={true} />{" "}
      <MyForm handleFunction={handleSubmit(onSubmit)}>
        <InputTitle text="Nové heslo" />

        <div className="flex flex-col">
          <Inputlabel text="Heslo" />
          <input
            {...register("newPassword")}
            className={`input-field input-black-field ${
              errors.newPassword ? "border-red-500" : "border-transparent"
            }`}
            type="password"
          />
        </div>

        <ErrorMessage
          message={errors.newPassword?.message || serverError || undefined}
        />

        <button
          disabled={isSubmitting}
          className="input-button disabled:bg-gray-400"
          type="submit"
        >
          {isSubmitting ? "Nastavování..." : "Nastavit heslo"}
        </button>
      </MyForm>{" "}
      <Footer />
    </div>
  );
}

export default NewPasswordPage;
