import InputTitle from "../components/InputTitle";
import MyForm from "../components/MyForm";
import InputLink from "../components/InputLink";

function ResetPasswordSentPage() {
  return (
    <MyForm>
      <InputTitle text="Zapomenuté heslo" />
      <p className="text-black max-w-110 text-center">
        Na váš email byl odeslán odkaz pro reset hesla. Pokud nedojde do pár
        minut, zkontrolujte také složku se spamem
      </p>
      <InputLink text="Zpět na přihlášení" to="/login" />
    </MyForm>
  );
}

export default ResetPasswordSentPage;
