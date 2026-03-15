import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { OTPInput } from "input-otp";

import { resetPasswordSchema, type ResetPasswordInput } from "@shared/index";

import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ResetPasswordSentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      code: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-reset-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await res.json();

      if (!res.ok || result.valid === false) {
        setServerError(result.error || "Neplatný ověřovací kód");
        return;
      }

      navigate("/newPassword", {
        state: { email: data.email, code: data.code },
      });
    } catch (error) {
      console.error("Chyba při ověřování kódu:", error);
      setServerError("Chyba spojení se serverem");
    }
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] body-bg-color text-white">
      <Header homePage={false} logo={false} withoutPadding />

      <div className="max-w-[520px] mx-auto px-4 sm:px-6 pt-16 pb-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full header-color border border-white/10 rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-center">
            Ověření resetovacího kódu
          </h2>

          <p className="text-gray-300 text-center text-sm">
            Na váš email <strong>{email}</strong> byl odeslán kód pro reset
            hesla. Zkontrolujte také složku se spamem.
          </p>

          <div className="flex justify-center">
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <OTPInput
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  render={({ slots }) => (
                    <div className="flex gap-2">
                      {slots.map((slot, idx) => (
                        <div
                          key={idx}
                          className={`w-10 h-12 border-2 flex items-center justify-center text-xl font-bold rounded-lg transition-all ${
                            slot.isActive
                              ? "border-green-500 ring-2 ring-green-200"
                              : errors.code || serverError
                                ? "border-red-500"
                                : "border-white/20"
                          } bg-black text-white`}
                        >
                          {slot.char || ""}
                          {slot.hasFakeCaret && (
                            <div className="animate-caret-blink w-px h-6 bg-white" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                />
              )}
            />
          </div>

          <ErrorMessage
            message={errors.code?.message || serverError || undefined}
          />

          <div className="flex flex-col gap-4 pt-6">
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition disabled:bg-gray-500"
            >
              {isSubmitting ? "Ověřování..." : "Ověřit kód"}
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

export default ResetPasswordSentPage;
