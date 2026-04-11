import { Route, Routes } from "react-router";

import { AuthProvider } from "./context/AuthProvider";
import { AuthRedirectHandler } from "./utils/AuthRedirectHandler";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/Toast";

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
import ProfilePage from "./pages/ProfilePage";
import NewPasswordPage from "./pages/NewPasswordPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCanceledPage from "./pages/PaymentCanceledPage";
import GetCreditPage from "./pages/GetCreditPage";
import GetCardPage from "./pages/GetCardPage";
import CartPage from "./pages/CartPage";
import DeliveryPage from "./pages/DeliveryPage";
import OverviewPage from "./pages/OverviewPage";
import ScrollToTop from "./components/ScrollToTop";
import BussinessConditions from "./pages/BussinessConditions";
import AdminPage from "./pages/AdminPage";
import EshopGate from "./components/EshopGate";

function App() {
  return (
    <ToastProvider>
    <AuthProvider>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="o-nas" element={<AboutPage />} />
        <Route path="novinky" element={<NewsPage />} />
        <Route path="nabidka" element={<OfferPage />} />
        <Route path="firmy" element={<PartnersPage />} />
        <Route path="kontakt" element={<ContactPage />} />
        <Route path="payment/success" element={<PaymentSuccessPage />} />
        <Route path="payment/cancel" element={<PaymentCanceledPage />} />
        <Route path="obchodni-podminky" element={<BussinessConditions />} />

        <Route element={<AuthRedirectHandler />}>
          <Route path="login" element={<EshopGate><LoginPage /></EshopGate>} />
          <Route path="register" element={<EshopGate><RegisterPage /></EshopGate>} />
          <Route path="forgotPassword" element={<EshopGate><ForgetPasswordPage /></EshopGate>} />
          <Route path="resetPassword" element={<EshopGate><ResetPasswordSentPage /></EshopGate>} />
          <Route path="newPassword" element={<EshopGate><NewPasswordPage /></EshopGate>} />
        </Route>

        <Route path="souhrn" element={<EshopGate><OverviewPage /></EshopGate>} />
        <Route path="doprava" element={<EshopGate><DeliveryPage /></EshopGate>} />
        <Route path="kosik" element={<EshopGate><CartPage /></EshopGate>} />
        <Route path="dobit-kartu" element={<EshopGate><GetCreditPage /></EshopGate>} />
        <Route path="objednat-kartu" element={<EshopGate><GetCardPage /></EshopGate>} />
        <Route path="moje-karty" element={<EshopGate><AccountPage /></EshopGate>} />
        <Route path="profil" element={<EshopGate><ProfilePage /></EshopGate>} />
        <Route path="admin" element={<AdminPage />} />
      </Routes>
    </AuthProvider>
    </ToastProvider>
  );
}

export default App;
