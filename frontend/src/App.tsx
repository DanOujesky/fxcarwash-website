import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import NewsPage from "./pages/NewsPage";
import PartnersPage from "./pages/PartnersPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />}></Route>
      <Route path="o-nas" element={<AboutPage />}></Route>
      <Route path="novinky" element={<NewsPage />}></Route>
      <Route path="pro-firmy" element={<PartnersPage />}></Route>
      <Route path="kontakt" element={<ContactPage />}></Route>
    </Routes>
  );
}

export default App;
