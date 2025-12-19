import InputTitle from "../components/InputTitle";
import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const forgetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatná emailová adresa"),
});

function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<{ email?: string }>({});
  const navigate = useNavigate();

  const resetPassword: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setError({});

    const validation = forgetPasswordSchema.safeParse({ email });

    if (!validation.success) {
      const formattedErrors: typeof error = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof formattedErrors;
        formattedErrors[field] = issue.message;
      });

      setError(formattedErrors);
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
      if (data.exists === false) {
        setError({ email: "Tento e-mail není registrován" });

        return;
      }

      navigate("/resetPassword", {
        state: { email: data.email, message: data.message },
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <MyForm handleFunction={resetPassword}>
      <InputTitle text="Obnovení hesla" />
      <div className="flex flex-col">
        <Inputlabel text="E-mail" />
        <input
          className="input-field"
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
      <button className="input-button" type="submit">
        Obnovit heslo
      </button>
    </MyForm>
  );
}
export default ForgetPasswordPage;
