import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

import NewsPage from "./pages/NewsPage";
import PartnersPage from "./pages/PartnersPage";
import ContactPage from "./pages/ContactPage";
import OfferPage from "./pages/OfferPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ResetPasswordSentPage from "./pages/ResetPasswordSentPage";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />}></Route>
      <Route path="o-nas" element={<AboutPage />}></Route>
      <Route path="novinky" element={<NewsPage />}></Route>
      <Route path="nabidka" element={<OfferPage />}></Route>
      <Route path="firmy" element={<PartnersPage />}></Route>
      <Route path="kontakt" element={<ContactPage />}></Route>
      <Route path="login" element={<LoginPage />}></Route>
      <Route path="register" element={<RegisterPage />}></Route>
      <Route path="forgotPassword" element={<ForgetPasswordPage />}></Route>
      <Route
        path="forgotPasswordSent"
        element={<ResetPasswordSentPage />}
      ></Route>
    </Routes>
  );
}

export default App;
