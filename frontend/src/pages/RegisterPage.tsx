import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import InputTitle from "../components/InputTitle";
import { useState } from "react";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatná emailová adresa"),

  password: z
    .string()
    .min(8, "Heslo musí mít alespoň 8 znaků")
    .max(50, "Heslo je příliš dlouhé")
    .regex(/[0-9]/, "Heslo musí obsahovat alespoň jedno číslo"),
});

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();

  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors({});

    const validation = registerSchema.safeParse({ email, password });

    if (!validation.success) {
      const formattedErrors: typeof errors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof formattedErrors;
        formattedErrors[field] = issue.message;
      });

      setErrors(formattedErrors);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.message);
      } else {
        navigate("/login", { state: { email: email } });
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <MyForm handleFunction={handleRegister}>
      <InputTitle text="Registrace" />
      <div className="flex flex-col">
        <Inputlabel text="E-mail" />
        <input
          className={`input-field ${errors.email ? "border-red-500" : ""}`}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <Inputlabel text="Heslo" />
        <input
          className={`input-field ${errors.password ? "border-red-500" : ""}`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errors.email && (
        <span className="text-red-500 text-center text-sm contactText">
          {errors.email}
        </span>
      )}
      {errors.password && (
        <span className="text-red-500 text-center text-sm contactText">
          {errors.password}
        </span>
      )}
      <Link
        to="/login"
        className="text-black contactText text-center hover:underline"
      >
        Už jste zaregistrovaní? Přihlaste se
      </Link>
      <button className="input-button" type="submit">
        Registrovat se
      </button>
    </MyForm>
  );
}

export default RegisterPage;
