import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { OTPInput } from "input-otp";

import { resetPasswordSchema, type ResetPasswordInput } from "@shared/index";

import InputTitle from "../components/InputTitle";
import MyForm from "../components/MyForm";
import InputLink from "../components/InputLink";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";

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
    <div className="min-h-screen bg-[#252525]">
      <Header takePosition={true} homePage={false} withoutPadding={true} />{" "}
      <MyForm handleFunction={handleSubmit(onSubmit)}>
        <InputTitle text="Zapomenuté heslo" />

        <p className="text-black max-w-110 text-center">
          Na váš email <strong>{email}</strong> byl odeslán kód pro reset hesla.
          Zkontrolujte také složku se spamem.
        </p>

        <div className="flex flex-col items-center gap-4">
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
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : errors.code || serverError
                              ? "border-red-500"
                              : "border-gray-700"
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

        <button
          disabled={isSubmitting}
          className="input-button disabled:bg-gray-400"
          type="submit"
        >
          {isSubmitting ? "Ověřování..." : "Ověřit kód"}
        </button>

        <InputLink text="Zpět na přihlášení" to="/login" />
      </MyForm>{" "}
    </div>
  );
}

export default ResetPasswordSentPage;
