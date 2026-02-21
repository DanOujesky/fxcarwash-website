import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      setUser(null);
    }
  };
  const refreshCards = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/nayax/refreshCards`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            cards: data.cards,
          };
        });
      }
    } catch (error) {
      console.error("Refresh cards failed:", error);
    }
  };
  const checkAuth = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        credentials: "include",
      });

      if (res.status === 401) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        logout,
        checkAuth,
        refreshCards,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
