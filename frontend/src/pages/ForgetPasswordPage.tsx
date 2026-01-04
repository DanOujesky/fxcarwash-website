import InputTitle from "../components/InputTitle";
import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import InputLink from "../components/InputLink";

const forgetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatná emailová adresa"),
});

function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<{ email?: string }>({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setError({});

    const validation = forgetPasswordSchema.safeParse({ email });

    if (!validation.success) {
      const formattedErrors: typeof error = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof formattedErrors;
        formattedErrors[field] = issue.message;
      });

      setError(formattedErrors);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/email-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validation.data),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError({ email: data.error || "Něco se nepovedlo" });
        return;
      }
      if (data.exists === false) {
        setError({ email: "Tento e-mail není registrován" });
        return;
      }

      navigate("/resetPassword", {
        state: { email: data.email, message: data.message },
      });
    } catch (err) {
      console.error(err);
      setError({ email: "Chyba serveru. Zkuste to prosím později." });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MyForm handleFunction={resetPassword}>
      <InputTitle text="Obnovení hesla" />
      <div className="flex flex-col">
        <Inputlabel text="E-mail" />
        <input
          className="input-field bg-black text-white"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {error.email && (
        <span className="text-red-500 text-center text-sm contactText">
          {error.email}
        </span>
      )}
      <button disabled={isLoading} className="input-button" type="submit">
        {isLoading ? "Odesílám..." : "obnovit heslo"}
      </button>
      <InputLink text="Zpět na přihlášení" to="/login" />
    </MyForm>
  );
}
export default ForgetPasswordPage;
