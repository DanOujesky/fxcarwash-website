import InputTitle from "../components/InputTitle";
import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import { useState } from "react";

function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const resetPassword: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
  };
  return (
    <MyForm handleFunction={resetPassword}>
      <InputTitle text="Obnovení hesla" />
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
      <button className="input-button" type="submit">
        Obnovit heslo
      </button>
    </MyForm>
  );
}
export default ForgetPasswordPage;
