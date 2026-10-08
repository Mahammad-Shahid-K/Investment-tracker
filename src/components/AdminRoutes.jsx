import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AdminRoute() {
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading || (user && profileLoading)) {
    return (
      <div className="loading-screen">
        <h2>Loading Admin Panel...</h2>
        <p>Checking administrator permissions</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile?.is_active === false) {
    return <Navigate to="/login" replace />;
  }

  if (profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;