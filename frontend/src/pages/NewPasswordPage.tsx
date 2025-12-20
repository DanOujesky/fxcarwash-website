import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import InputTitle from "../components/InputTitle";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";

const newPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatná emailová adresa"),

  newPassword: z
    .string()
    .min(8, "Heslo musí mít alespoň 8 znaků")
    .max(50, "Heslo je příliš dlouhé")
    .regex(/[0-9]/, "Heslo musí obsahovat alespoň jedno číslo"),
});

function NewPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<{ newPassword?: string }>({});
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleNewPassword: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validation = newPasswordSchema.safeParse({ email, newPassword });

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
        `${import.meta.env.VITE_API_URL}/auth/newPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validation.data),
        }
      );
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.message);
      } else {
        navigate("/login", { state: { email: email } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MyForm handleFunction={handleNewPassword}>
      <InputTitle text="Nové heslo" />
      <div className="flex flex-col">
        <Inputlabel text="Heslo" />
        <input
          className={`input-field ${
            errors.newPassword ? "border-red-500" : ""
          }`}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      {errors.newPassword && (
        <span className="text-red-500 text-center text-sm contactText">
          {errors.newPassword}
        </span>
      )}
      <button disabled={isLoading} className="input-button" type="submit">
        Nastavit nové heslo
      </button>
    </MyForm>
  );
}

export default NewPasswordPage;
