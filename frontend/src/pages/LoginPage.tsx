import { Link, useLocation } from "react-router";
import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import InputTitle from "../components/InputTitle";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatná emailová adresa"),

  password: z
    .string()
    .min(8, "Heslo musí mít alespoň 8 znaků")
    .max(50, "Heslo je příliš dlouhé")
    .regex(/[0-9]/, "Heslo musí obsahovat alespoň jedno číslo"),
});

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);
  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setResponse(null);

    const validation = loginSchema.safeParse({ email, password });

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(validation.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setResponse(data.error);
        return;
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MyForm handleFunction={handleLogin}>
      <InputTitle text="Přihlášení" />
      <div className="flex flex-col">
        <Inputlabel text="E-mail" />
        <input
          className="input-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <Inputlabel text="Heslo" />
          <Link
            className="text-black contactText text-[13px] hover:underline"
            to="/forgotPassword"
          >
            Zapomenuté heslo?
          </Link>
        </div>
        <input
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
      {response && (
        <span className="text-red-500 text-center text-sm contactText">
          {response}
        </span>
      )}
      <Link
        to="/register"
        className="text-black contactText text-center hover:underline"
      >
        Nemáte účet? Zaregistrujte se
      </Link>
      <button disabled={isLoading} className="input-button" type="submit">
        {isLoading ? "Přihlašování..." : "Přihlásit se"}
      </button>
    </MyForm>
  );
}
export default LoginPage;
