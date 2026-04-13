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
            <div className="flex justify-between items-center">
              <Inputlabel white text="Heslo" />

              <button
                type="button"
                className="text-white text-sm hover:underline"
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
              type="password"
              className={`input-field input-white-field ${
                errors.password ? "border-red-500" : "border-transparent"
              }`}
            />
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
