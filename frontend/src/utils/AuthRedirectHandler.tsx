import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AuthRedirectHandler = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (user) {
    const params = new URLSearchParams(location.search);
    const preview = params.get("preview");
    const to = preview ? `/moje-karty?preview=${encodeURIComponent(preview)}` : "/moje-karty";
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
};
