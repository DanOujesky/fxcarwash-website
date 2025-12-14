import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

import NewsPage from "./pages/NewsPage";
import PartnersPage from "./pages/PartnersPage";
import ContactPage from "./pages/ContactPage";
import OfferPage from "./pages/OfferPage";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />}></Route>
      <Route path="o-nas" element={<AboutPage />}></Route>
      <Route path="novinky" element={<NewsPage />}></Route>
      <Route path="nabidka" element={<OfferPage />}></Route>
      <Route path="firmy" element={<PartnersPage />}></Route>
      <Route path="kontakt" element={<ContactPage />}></Route>
    </Routes>
  );
}

export default App;
