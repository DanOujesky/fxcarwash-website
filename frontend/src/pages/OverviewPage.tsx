import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";

function OverviewPage() {
  const { user, loading } = useAuth();
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
    <div className="min-h-screen bg-[#252525]">
      <Header account={true} homePage={false} />
      <div className="flex flex-col justify-center items-center body-bg-color pt-15">
        <CartPhaseDisplay delivery={true} phaseNumber={3} />
      </div>
    </div>
  );
}

export default OverviewPage;
