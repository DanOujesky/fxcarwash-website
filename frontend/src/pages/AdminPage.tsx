import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface CardStats {
  inStock: number;
  assigned: number;
  blocked: number;
  lost: number;
  total: number;
}

interface OrderStats {
  total: number;
  paid: number;
  pending: number;
  cancelled: number;
  refunded: number;
  shipped: number;
  totalRevenue: number;
}

interface TopProduct {
  name: string;
  count: number;
  revenue: number;
}

interface RecentOrder {
  orderFullNumber: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  userEmail: string;
}

interface NewsItem {
  id: string;
  title: string;
  text: string;
  image: string[];
  createdAt: string;
}

interface AdminStats {
  cards: CardStats;
  orders: OrderStats;
  users: {
    total: number;
    newLast30Days: number;
  };
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  creditStats: {
    totalCreditIssued: number;
    avgCreditPerOrder: number;
  };
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    PAID: "bg-green-500/20 text-green-400",
    PENDING: "bg-yellow-500/20 text-yellow-400",
    CANCELLED: "bg-red-500/20 text-red-400",
    REFUNDED: "bg-purple-500/20 text-purple-400",
    SHIPPED: "bg-blue-500/20 text-blue-400",
  };
  const statusLabels: Record<string, string> = {
    PAID: "Zaplaceno",
    PENDING: "Čeká",
    CANCELLED: "Zrušeno",
    REFUNDED: "Vráceno",
    SHIPPED: "Odesláno",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? "bg-white/10 text-white/60"}`}>
      {statusLabels[status] ?? status}
    </span>
  );
};

function AdminPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [csvText, setCsvText] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);

  const [reclaimNumber, setReclaimNumber] = useState("");
  const [reclaimLoading, setReclaimLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsText, setNewsText] = useState("");
  const [newsFiles, setNewsFiles] = useState<File[]>([]);
  const [newsSaving, setNewsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!loading && user && user.role !== "ADMIN") {
      navigate("/moje-karty", { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!loading && user && user.role === "ADMIN") {
      fetchStats();
      fetchNews();
    }
  }, [loading, user]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Chyba načítání statistik");
      const data = await res.json();
      setStats(data);
    } catch {
      showToast({ type: "error", title: "Chyba", message: "Nepodařilo se načíst statistiky" });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/news`, { credentials: "include" });
      if (!res.ok) throw new Error();
      setNewsList(await res.json());
    } catch {
      showToast({ type: "error", title: "Chyba", message: "Nepodařilo se načíst novinky" });
    } finally {
      setNewsLoading(false);
    }
  };

  const handleCreateNews = async () => {
    if (!newsTitle.trim() || !newsText.trim()) {
      showToast({ type: "warning", title: "Chybí údaje", message: "Vyplňte název a text novinky" });
      return;
    }
    setNewsSaving(true);
    try {
      let images: string[] = [];
      if (newsFiles.length > 0) {
        const formData = new FormData();
        newsFiles.forEach((f) => formData.append("images", f));
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/news/upload`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Chyba uploadu");
        images = uploadData.urls;
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/news`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newsTitle, text: newsText, images }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chyba");
      showToast({ type: "success", title: "Novinka přidána", message: newsTitle });
      setNewsTitle("");
      setNewsText("");
      setNewsFiles([]);
      fetchNews();
    } catch (err: any) {
      showToast({ type: "error", title: "Chyba", message: err.message });
    } finally {
      setNewsSaving(false);
    }
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (!window.confirm(`Smazat novinku "${title}"?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/news/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      showToast({ type: "success", title: "Smazáno", message: title });
      fetchNews();
    } catch {
      showToast({ type: "error", title: "Chyba", message: "Nepodařilo se smazat novinku" });
    }
  };

  const handleImport = async () => {
    if (!csvText.trim()) {
      showToast({ type: "warning", title: "Prázdné CSV", message: "Vložte CSV data pro import" });
      return;
    }
    setImportLoading(true);
    setImportResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/cards/import`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chyba importu");
      setImportResult(data);
      showToast({ type: "success", title: "Import dokončen", message: `Importováno: ${data.imported}, přeskočeno: ${data.skipped}` });
      fetchStats();
    } catch (err: any) {
      showToast({ type: "error", title: "Chyba importu", message: err.message });
    } finally {
      setImportLoading(false);
    }
  };

  const handleReclaim = async () => {
    if (!reclaimNumber.trim()) {
      showToast({ type: "warning", title: "Chybí číslo karty", message: "Zadejte číslo karty" });
      return;
    }
    setReclaimLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/cards/reclaim`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber: reclaimNumber.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chyba odebrání karty");
      showToast({ type: "success", title: "Karta odebrána", message: `Karta ${reclaimNumber} byla odebrána z účtu` });
      setReclaimNumber("");
      fetchStats();
    } catch (err: any) {
      showToast({ type: "error", title: "Chyba", message: err.message });
    } finally {
      setReclaimLoading(false);
    }
  };

  if (loading || !user) {
    return <div className="bg-black min-h-screen" />;
  }

  if (user.role !== "ADMIN") {
    return <div className="bg-black min-h-screen" />;
  }

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] body-bg-color">
      <Header account={false} homePage={false} logo={false} withoutPadding={true} />

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
            Admin panel
          </h1>
          <button
            onClick={async () => {
              setLogoutLoading(true);
              await logout();
              navigate("/login", { replace: true });
            }}
            disabled={logoutLoading}
            className="bg-white/10 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed text-white/80 px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            {logoutLoading ? "Odhlašuji..." : "Odhlásit se"}
          </button>
        </div>

        <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-5">Karty</h2>
          {statsLoading ? (
            <div className="text-white/40 text-sm">Načítám...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="text-green-400 text-xs uppercase tracking-wider mb-1">Dostupné</div>
                <div className="text-2xl font-bold text-green-400">{stats?.cards.inStock ?? 0}</div>
                <div className="text-white/40 text-xs mt-1">IN_STOCK</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="text-blue-400 text-xs uppercase tracking-wider mb-1">Přiřazené</div>
                <div className="text-2xl font-bold text-blue-400">{stats?.cards.assigned ?? 0}</div>
                <div className="text-white/40 text-xs mt-1">ASSIGNED</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="text-yellow-400 text-xs uppercase tracking-wider mb-1">Blokované</div>
                <div className="text-2xl font-bold text-yellow-400">{stats?.cards.blocked ?? 0}</div>
                <div className="text-white/40 text-xs mt-1">BLOCKED</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Celkem karet</div>
                <div className="text-2xl font-bold text-white">{stats?.cards.total ?? 0}</div>
                <div className="text-white/40 text-xs mt-1">TOTAL</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-5">Import karet</h2>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={"number,identifier\n065,4251023030\n066,4251023031"}
            rows={6}
            className="w-full bg-[#252525] border border-white/10 rounded-lg px-4 py-3 text-white/80 text-sm font-mono placeholder-white/30 focus:outline-none focus:border-white/30 resize-y mb-4"
          />
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleImport}
              disabled={importLoading}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
            >
              {importLoading ? "Importuji..." : "Importovat"}
            </button>
            {importResult && (
              <span className="text-sm text-white/60">
                Importováno: <span className="text-green-400 font-semibold">{importResult.imported}</span>
                , přeskočeno: <span className="text-yellow-400 font-semibold">{importResult.skipped}</span>
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-5">Odebrat kartu z účtu</h2>
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              value={reclaimNumber}
              onChange={(e) => setReclaimNumber(e.target.value)}
              placeholder="Číslo karty (např. 065)"
              className="flex-1 min-w-[200px] bg-[#252525] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30"
              onKeyDown={(e) => { if (e.key === "Enter") handleReclaim(); }}
            />
            <button
              onClick={handleReclaim}
              disabled={reclaimLoading}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
            >
              {reclaimLoading ? "Odebírám..." : "Odebrat kartu"}
            </button>
          </div>
        </div>

        <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-5">Statistiky e-shopu</h2>

          {statsLoading ? (
            <div className="text-white/40 text-sm">Načítám...</div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-[#252525] border border-white/10 rounded-lg p-4 flex flex-col">
                  <div className="text-white/50 text-xs uppercase tracking-wider flex-1">Celkem objednávek</div>
                  <div className="text-2xl font-bold text-white mt-2">{stats?.orders.total ?? 0}</div>
                </div>
                <div className="col-span-2 bg-[#252525] border border-white/10 rounded-lg p-4 flex flex-col">
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Celkový obrat</div>
                  <div className="text-3xl font-bold text-green-400">
                    {(stats?.orders.totalRevenue ?? 0).toLocaleString("cs-CZ")} Kč
                  </div>
                </div>
                <div className="bg-[#252525] border border-white/10 rounded-lg p-4 flex flex-col">
                  <div className="text-white/50 text-xs uppercase tracking-wider flex-1">Uživatelé celkem</div>
                  <div className="text-2xl font-bold text-blue-400 mt-2">{stats?.users.total ?? 0}</div>
                </div>
              </div>

              {stats && stats.topProducts.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Top produkty</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-white/40 font-normal pb-2 pr-4">Název</th>
                          <th className="text-right text-white/40 font-normal pb-2 pr-4">Počet</th>
                          <th className="text-right text-white/40 font-normal pb-2">Obrat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.topProducts.map((p, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-2.5 pr-4 text-white/80">{p.name}</td>
                            <td className="py-2.5 pr-4 text-right text-white/60">{p.count}</td>
                            <td className="py-2.5 text-right text-white/60">
                              {p.revenue.toLocaleString("cs-CZ")} Kč
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {stats && stats.recentOrders.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Poslední objednávky</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-white/40 font-normal pb-2 pr-4">Číslo</th>
                          <th className="text-left text-white/40 font-normal pb-2 pr-4">Uživatel</th>
                          <th className="text-right text-white/40 font-normal pb-2 pr-4">Cena</th>
                          <th className="text-left text-white/40 font-normal pb-2 pr-4">Status</th>
                          <th className="text-right text-white/40 font-normal pb-2">Datum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders.map((o, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-2.5 pr-4 text-white font-mono text-xs">{o.orderFullNumber}</td>
                            <td className="py-2.5 pr-4 text-white/60 truncate max-w-[150px]">{o.userEmail}</td>
                            <td className="py-2.5 pr-4 text-right text-white/80">
                              {o.totalPrice.toLocaleString("cs-CZ")} Kč
                            </td>
                            <td className="py-2.5 pr-4">{statusBadge(o.status)}</td>
                            <td className="py-2.5 text-right text-white/40 text-xs whitespace-nowrap">
                              {new Date(o.createdAt).toLocaleDateString("cs-CZ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-5">Správa novinky</h2>

          <div className="flex flex-col gap-3 mb-6">
            <input
              type="text"
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              placeholder="Název novinky"
              className="w-full bg-[#252525] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30"
            />
            <textarea
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              placeholder="Text novinky"
              rows={4}
              className="w-full bg-[#252525] border border-white/10 rounded-lg px-4 py-3 text-white/80 text-sm placeholder-white/30 focus:outline-none focus:border-white/30 resize-y"
            />
            <div className="flex flex-col gap-1">
              <label className="w-full bg-[#252525] border border-white/10 rounded-lg px-4 py-2.5 text-white/50 text-sm cursor-pointer hover:border-white/30 transition">
                {newsFiles.length > 0
                  ? `${newsFiles.length} obrázek vybrán: ${newsFiles.map((f) => f.name).join(", ")}`
                  : "Vyberte obrázky (volitelné)"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => setNewsFiles(Array.from(e.target.files ?? []))}
                />
              </label>
              {newsFiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setNewsFiles([])}
                  className="self-start text-white/40 hover:text-white/70 text-xs transition"
                >
                  Zrušit výběr
                </button>
              )}
            </div>
            <button
              onClick={handleCreateNews}
              disabled={newsSaving}
              className="self-start bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
            >
              {newsSaving ? "Ukládám..." : "Přidat novinku"}
            </button>
          </div>

          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Existující novinky</h3>
          {newsLoading ? (
            <div className="text-white/40 text-sm">Načítám...</div>
          ) : newsList.length === 0 ? (
            <div className="text-white/40 text-sm">Žádné novinky</div>
          ) : (
            <div className="flex flex-col gap-2">
              {newsList.map((n) => (
                <div key={n.id} className="flex items-start justify-between gap-4 bg-[#252525] border border-white/10 rounded-lg px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{n.title}</div>
                    <div className="text-white/40 text-xs mt-0.5">
                      {new Date(n.createdAt).toLocaleDateString("cs-CZ")}
                      {n.image.length > 0 && ` · ${n.image.length} obrázek`}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteNews(n.id, n.title)}
                    className="text-red-400 hover:text-red-300 text-xs whitespace-nowrap transition"
                  >
                    Smazat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminPage;
