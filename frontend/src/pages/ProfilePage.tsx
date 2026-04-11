import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Inputlabel from "../components/InputLabel";

function ProfilePage() {
  const { user, loading, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        city: user.city ?? "",
        zipCode: user.zipCode ?? "",
        country: user.country ?? "",
      });
    }
  }, [user]);

  if (loading || !user) {
    return <div className="bg-black min-h-screen" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast({
          type: "error",
          title: "Chyba",
          message: data.error || "Nepodařilo se uložit změny",
        });
        return;
      }

      setUser({ ...user, ...data.user });
      showToast({
        type: "success",
        title: "Uloženo",
        message: "Údaje byly úspěšně aktualizovány",
      });
    } catch {
      showToast({
        type: "error",
        title: "Chyba spojení",
        message: "Nepodařilo se spojit se serverem",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] body-bg-color text-white">
      <Header
        account={true}
        homePage={false}
        logo={false}
        withoutPadding={true}
      />

      <div className="max-w-[560px] mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-7 h-7 text-white/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-xs text-gray-500 hover:text-red-400 disabled:opacity-50 transition-colors border border-white/10 hover:border-red-400/30 rounded-full px-3 py-1.5 self-center whitespace-nowrap"
          >
            {isLoggingOut ? "Odhlašuji..." : "Odhlásit se"}
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="flex flex-col gap-5 bg-[#1b1b1b] border border-white/10 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-base font-semibold text-white/80 mb-1">
            Osobní údaje
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Inputlabel white text="Jméno" />
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="input-field input-white-field border-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Inputlabel white text="Příjmení" />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="input-field input-white-field border-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Inputlabel white text="E-mail" />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input-field input-white-field border-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Inputlabel white text="Telefon" />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="input-field input-white-field border-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Inputlabel white text="Ulice a číslo popisné" />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="input-field input-white-field border-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Inputlabel white text="Město" />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="input-field input-white-field border-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Inputlabel white text="PSČ" />
              <input
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                className="input-field input-white-field border-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Inputlabel white text="Země" />
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              className="input-field input-white-field border-white"
            />
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white py-3 rounded-lg transition font-medium"
            >
              {isSaving ? "Ukládám..." : "Uložit změny"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/moje-karty")}
              className="border border-white/20 text-white py-3 rounded-lg hover:bg-white/5 transition font-medium"
            >
              Zpět
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default ProfilePage;
