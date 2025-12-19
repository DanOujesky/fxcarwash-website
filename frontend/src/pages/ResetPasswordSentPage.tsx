import InputTitle from "../components/InputTitle";
import MyForm from "../components/MyForm";
import InputLink from "../components/InputLink";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const resetPasswordSchema = z.object({
  code: z.string().length(6, "Kód musí mít přesně 6 znaků"),
});

function ResetPasswordSentPage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ code?: string }>({});

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);

    setErrors({});

    const validation = resetPasswordSchema.safeParse({ code });

    if (!validation.success) {
      const formattedErrors: typeof errors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof formattedErrors;
        formattedErrors[field] = issue.message;
      });

      setErrors(formattedErrors);
      return;
    }

    if (e.target.value.length > 5) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/register`,
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
          setErrors({ code: "Neplatný kód" });
          return;
        }
        navigate("/newPassword");
      } catch (error) {
        console.error("Error during navigation:", error);
      }
    }
  }
  return (
    <MyForm>
      <InputTitle text="Zapomenuté heslo" />
      <p className="text-black max-w-110 text-center">
        Na váš email byl odeslán kod pro reset hesla. Pokud nedojde do pár
        minut, zkontrolujte také složku se spamem
      </p>
      <input
        className="input-field"
        type="text"
        value={code}
        onChange={handleChange}
        required
      />
      {errors.code && (
        <span className="text-red-500 text-center text-sm contactText">
          {errors.code}
        </span>
      )}
      <InputLink text="Zpět na přihlášení" to="/login" />
    </MyForm>
  );
}

export default ResetPasswordSentPage;
