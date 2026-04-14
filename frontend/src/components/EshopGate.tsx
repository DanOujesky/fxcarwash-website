import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const STORAGE_KEY = "eshop_preview_granted";
const ESHOP_ENABLED = import.meta.env.VITE_ESHOP_ENABLED === "true";
const PREVIEW_CODE = import.meta.env.VITE_ESHOP_PREVIEW_CODE as string | undefined;

function isGranted(search: string): boolean {
  // 1. Check current URL for preview param
  if (PREVIEW_CODE) {
    const params = new URLSearchParams(search);
    if (params.get("preview") === PREVIEW_CODE) {
      sessionStorage.setItem(STORAGE_KEY, PREVIEW_CODE);
      return true;
    }
  }
  // 2. Check sessionStorage (persists within the same tab session, clears on new tab/window)
  if (PREVIEW_CODE && sessionStorage.getItem(STORAGE_KEY) === PREVIEW_CODE) {
    return true;
  }
  return false;
}

// Module-level: runs once on initial page load — seed sessionStorage from URL
if (PREVIEW_CODE) {
  const params = new URLSearchParams(window.location.search);
  if (params.get("preview") === PREVIEW_CODE) {
    sessionStorage.setItem(STORAGE_KEY, PREVIEW_CODE);
  }
}

function ComingSoon() {
  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] body-bg-color text-white flex flex-col">
      <Header homePage={false} logo={false} withoutPadding />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6 py-10">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
          <svg
            className="w-7 h-7 text-white/50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
          Připravujeme pro vás
        </h1>
        <p className="text-white/50 max-w-sm text-sm leading-relaxed">
          Sekce FX karet bude brzy k dispozici. Sledujte naše novinky.
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default function EshopGate({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (ESHOP_ENABLED) return <>{children}</>;
  if (isGranted(location.search)) return <>{children}</>;
  return <ComingSoon />;
}
