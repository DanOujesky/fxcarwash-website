import { useEffect, useState } from "react";
import { useToast, type Toast as ToastItem } from "../context/ToastContext";

const ICONS: Record<string, string> = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

const STYLES: Record<string, { border: string; icon: string; bar: string }> = {
  success: {
    border: "border-green-500/40",
    icon: "bg-green-500/20 text-green-400",
    bar: "bg-green-500",
  },
  error: {
    border: "border-red-500/40",
    icon: "bg-red-500/20 text-red-400",
    bar: "bg-red-500",
  },
  warning: {
    border: "border-yellow-500/40",
    icon: "bg-yellow-500/20 text-yellow-400",
    bar: "bg-yellow-500",
  },
  info: {
    border: "border-blue-500/40",
    icon: "bg-blue-500/20 text-blue-400",
    bar: "bg-blue-500",
  },
};

function ToastCard({ toast }: { toast: ToastItem }) {
  const { dismissToast } = useToast();
  const [visible, setVisible] = useState(false);
  const duration = toast.duration ?? 5000;
  const style = STYLES[toast.type];

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(show);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-[#1c1c1c] shadow-2xl w-full max-w-sm transition-all duration-300 ease-out ${style.border} ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      }`}
    >
      <div className="flex items-center gap-3 p-4">
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${style.icon}`}
          dangerouslySetInnerHTML={{ __html: ICONS[toast.type] }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">
            {toast.title}
          </p>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-400 leading-snug">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={() => dismissToast(toast.id)}
          className="flex-shrink-0 text-gray-500 hover:text-white transition-colors"
          aria-label="Zavřít"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {duration > 0 && (
        <div
          className={`absolute bottom-0 left-0 h-0.5 ${style.bar}`}
          style={{
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      )}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto w-full max-w-sm">
          <ToastCard toast={t} />
        </div>
      ))}
    </div>
  );
}
