import { Route, Routes } from "react-router";

import { AuthProvider } from "./context/AuthProvider";
import { AuthRedirectHandler } from "./utils/AuthRedirectHandler";

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
import AccountPage from "./pages/AccountPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCanceledPage from "./pages/PaymentCanceledPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="o-nas" element={<AboutPage />} />
        <Route path="novinky" element={<NewsPage />} />
        <Route path="nabidka" element={<OfferPage />} />
        <Route path="firmy" element={<PartnersPage />} />
        <Route path="kontakt" element={<ContactPage />} />
        <Route path="payment/success" element={<PaymentSuccessPage />} />
        <Route path="payment/cancel" element={<PaymentCanceledPage />} />

        <Route element={<AuthRedirectHandler />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgotPassword" element={<ForgetPasswordPage />} />
          <Route path="resetPassword" element={<ResetPasswordSentPage />} />
          <Route path="newPassword" element={<NewPasswordPage />} />
        </Route>
        <Route path="account" element={<AccountPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
