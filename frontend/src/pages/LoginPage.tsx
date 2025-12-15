import { Link } from "react-router";
import InputField from "../components/inputField";
import Inputlabel from "../components/InputLabel";
import MyForm from "../components/MyForm";
import InputTitle from "../components/InputTitle";

function LoginPage() {
  return (
    <MyForm>
      <InputTitle text="Přihlášení" />
      <div className="flex flex-col">
        <Inputlabel text="E-mail" />
        <InputField type="email" />
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
        <InputField type="text" />
      </div>
      <button className="input-button" type="submit">
        Přihlásit se
      </button>
    </MyForm>
  );
}
export default LoginPage;
