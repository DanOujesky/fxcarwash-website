import { Link } from "react-router";
import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import InputTitle from "../components/InputTitle";
import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
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
            className="text-black contactText underline  text-[13px] hover:text-blue-500"
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
      <button className="input-button" type="submit">
        Přihlásit se
      </button>
    </MyForm>
  );
}
export default LoginPage;
