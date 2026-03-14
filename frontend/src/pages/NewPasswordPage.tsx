import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { newPasswordSchema, type NewPasswordInput } from "@shared/index";

import Inputlabel from "../components/InputLabel";
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
    <div className="min-h-screen pt-[121px] sm:pt-[185px] body-bg-color text-white">
      <Header account homePage={false} logo={false} withoutPadding />

      <div className="max-w-[520px] mx-auto px-4 sm:px-6 pt-16 pb-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full header-color border border-white/10 rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-center">
            Nastavení nového hesla
          </h2>

          <div className="flex flex-col">
            <Inputlabel white text="Nové heslo" />
            <input
              {...register("newPassword")}
              type="password"
              className={`input-field input-white-field ${
                errors.newPassword ? "border-red-500" : "border-transparent"
              }`}
            />
          </div>

          <ErrorMessage
            message={errors.newPassword?.message || serverError || undefined}
          />

          <div className="flex flex-col gap-4 pt-6">
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition disabled:bg-gray-500"
            >
              {isSubmitting ? "Nastavování..." : "Nastavit heslo"}
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

export default NewPasswordPage;
