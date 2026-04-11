import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { z } from "zod";

import { newPasswordSchema } from "@shared/index";
import Inputlabel from "../components/InputLabel";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";
import Footer from "../components/Footer";

const newPasswordFormSchema = newPasswordSchema
  .extend({
    confirmPassword: z.string().min(1, "Zadejte potvrzení hesla"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hesla se neshodují",
    path: ["confirmPassword"],
  });

type NewPasswordFormInput = z.infer<typeof newPasswordFormSchema>;

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function NewPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const code = location.state?.code || "";

  useEffect(() => {
    if (!email || !code) {
      navigate("/login", { replace: true });
    }
  }, [email, code, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormInput>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: { email, code, newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: NewPasswordFormInput) => {
    setServerError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/newPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, code: data.code, newPassword: data.newPassword }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Nepodařilo se změnit heslo");
        return;
      }

      navigate("/login", { state: { email: data.email } });
    } catch {
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
          <h2 className="text-lg font-semibold text-center">Nastavení nového hesla</h2>

          <div className="flex flex-col">
            <Inputlabel white text="Nové heslo" />
            <div className="relative">
              <input
                {...register("newPassword")}
                type={showNew ? "text" : "password"}
                className={`input-field input-white-field pr-12 w-full ${
                  errors.newPassword ? "border-red-500" : "border-transparent"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
                tabIndex={-1}
              >
                <EyeIcon open={showNew} />
              </button>
            </div>
            <ErrorMessage message={errors.newPassword?.message} />
          </div>

          <div className="flex flex-col">
            <Inputlabel white text="Potvrdit heslo" />
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                className={`input-field input-white-field pr-12 w-full ${
                  errors.confirmPassword ? "border-red-500" : "border-transparent"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
                tabIndex={-1}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            <ErrorMessage message={errors.confirmPassword?.message} />
          </div>

          <ErrorMessage message={serverError || undefined} />

          <div className="flex flex-col gap-4 pt-2">
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
