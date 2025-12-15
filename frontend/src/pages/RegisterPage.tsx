import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import InputTitle from "../components/InputTitle";
import { useState } from "react";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.message);
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
          className="input-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col">
        <Inputlabel text="Heslo" />
        <input
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="input-button" type="submit">
        Registrovat se
      </button>
    </MyForm>
  );
}

export default RegisterPage;
