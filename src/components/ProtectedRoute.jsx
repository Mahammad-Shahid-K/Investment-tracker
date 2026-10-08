import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute() {
  const { user, profile, loading, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || (user && profileLoading)) {
    return (
      <div className="loading-screen">
        <h2>Loading InvestTrack...</h2>
        <p>Checking your account</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (profile?.is_active === false) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;