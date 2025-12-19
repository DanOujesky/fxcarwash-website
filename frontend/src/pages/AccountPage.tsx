import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function AccountPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  return (
    <div className="p-10 text-white bg-black h-screen justify-center align-center flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-center">Můj Účet</h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg text-black font-semibold mb-2">Osobní údaje</h2>
        <p className="text-gray-700">
          <span className="font-medium">Email:</span> {user.email}
        </p>
      </div>

      <button
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={logout}
      >
        Odhlásit se
      </button>
    </div>
  );
}

export default AccountPage;
