import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { loginSchema, type LoginInput } from "@shared/index";

import Inputlabel from "../components/InputLabel";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";
import Footer from "../components/Footer";

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

      const previewParam = new URLSearchParams(window.location.search).get("preview");
      const previewCode = import.meta.env.VITE_ESHOP_PREVIEW_CODE as string | undefined;
      // Save existing grant before clearing (user may have arrived at /login without the param)
      const existingGrant = previewCode ? localStorage.getItem("eshop_preview_granted") : null;
      localStorage.clear();
      // Restore preview grant after clear so EshopGate works post-login
      if (previewCode && (previewParam === previewCode || existingGrant === previewCode)) {
        localStorage.setItem("eshop_preview_granted", previewCode);
      }
      window.location.href = previewParam
        ? `/moje-karty?preview=${encodeURIComponent(previewParam)}`
        : "/moje-karty";
    } catch (err) {
      console.error(err);
      setServerError("Chyba spojení se serverem");
    }
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] body-bg-color text-white">
      <Header homePage={false} logo={false} withoutPadding />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center  flex-col gap-1">
        <h2 className="text-white page-title-size mb-7">fx karty</h2>
        <p className="text-center textUnder mx-5">
          Po registraci/přihlášení nabízíme možnost objednání zvýhodněných
          předplacených karet, které můžete využít na služby našeho mycího
          centra.
        </p>
        <p className="text-center textUnder mx-5">
          Lze objednat novou kartu či opakovaně dobíjet stávající karty. V rámci
          věrnostního programu získáte od nás bonus v podobě kreditu navíc.
        </p>
        <p className="text-center textUnder mt-2 mx-5">
          Seznámit se s obchodními podmínkami e-shopu můžete zde:{" "}
          <a href="/obchodni-podminky" className="underline">
            obchodní podmínky
          </a>
        </p>
      </div>

      <div className="max-w-[520px] mx-auto px-4 sm:px-6 py-16">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full bg-[#1b1b1b] border border-white/10 rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-center">Přihlášení</h2>

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

          <div className="flex flex-col">
            <Inputlabel white text="Heslo" />
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={`input-field input-white-field w-full pr-11 ${
                  errors.password ? "border-red-500" : "border-transparent"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Skrýt heslo" : "Zobrazit heslo"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <ErrorMessage
            disableMargin
            message={
              errors.email?.message ||
              errors.password?.message ||
              serverError ||
              undefined
            }
          />

          <Link
            to="/register"
            className="text-white text-center hover:underline text-sm"
          >
            Nemáte účet? Zaregistrujte se
          </Link>

          <button
            type="button"
            className="text-white text-sm hover:underline text-center"
            onClick={() => {
              const currentEmail = getValues("email");
              navigate("/forgotPassword", {
                state: { email: currentEmail },
              });
            }}
          >
            Zapomenuté heslo?
          </button>

          <div className="flex flex-col gap-4 pt-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition disabled:bg-gray-500"
            >
              {isSubmitting ? "Přihlašování..." : "Přihlásit se"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default LoginPage;
