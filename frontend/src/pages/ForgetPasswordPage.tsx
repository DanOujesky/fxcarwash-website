import InputTitle from "../components/InputTitle";
import Inputlabel from "../components/InputLabel";
import InputField from "../components/inputField";
import MyForm from "../components/MyForm";

function ForgetPasswordPage() {
  return (
    <MyForm>
      <InputTitle text="Obnovení hesla" />
      <div className="flex flex-col">
        <Inputlabel text="E-mail" />
        <InputField type="email" />
      </div>
      <button className="input-button" type="submit">
        Obnovit heslo
      </button>
    </MyForm>
  );
}
export default ForgetPasswordPage;
