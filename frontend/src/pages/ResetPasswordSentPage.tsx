import InputTitle from "../components/InputTitle";
import MyForm from "../components/MyForm";
import InputLink from "../components/InputLink";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatná emailová adresa"),
  code: z.string().length(6, "Neplatný ověřovací kód"),
});

function ResetPasswordSentPage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ code?: string }>({});

  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleCodeVerification: React.FormEventHandler<
    HTMLFormElement
  > = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setErrors({});

    const validation = resetPasswordSchema.safeParse({ email, code });

    if (!validation.success) {
      const formattedErrors: typeof errors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof formattedErrors;
        formattedErrors[field] = issue.message;
      });

      setErrors(formattedErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-reset-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validation.data),
        }
      );

      const data = await res.json();
      if (data.valid === false) {
        setErrors({ code: data.error });
        return;
      }
      navigate("/newPassword", { state: { email: email } });
    } catch (error) {
      console.error("Error during navigation:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MyForm handleFunction={handleCodeVerification}>
      <InputTitle text="Zapomenuté heslo" />
      <p className="text-black max-w-110 text-center">
        Na váš email byl odeslán kod pro reset hesla. Pokud nedojde do pár
        minut, zkontrolujte také složku se spamem
      </p>
      <input
        className="input-field"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      {errors.code && (
        <span className="text-red-500 text-center text-sm contactText">
          {errors.code}
        </span>
      )}
      <button disabled={isLoading} className="input-button" type="submit">
        Ověřit kód
      </button>
      <InputLink text="Zpět na přihlášení" to="/login" />
    </MyForm>
  );
}

export default ResetPasswordSentPage;
