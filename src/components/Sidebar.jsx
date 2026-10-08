import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  BarChart3,
  Settings,
  TrendingUp,
  Shield,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

function Sidebar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <aside className="sidebar">

      <div className="logo">
        <TrendingUp size={28} />
        <span>InvestTrack</span>
      </div>

      <nav>

        <NavLink to="/">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/portfolio">
          <BriefcaseBusiness size={20} />
          <span>Portfolio</span>
        </NavLink>

        <NavLink to="/analytics">
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/settings">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

        {profile?.role === "admin" && (
          <NavLink to="/admin">
            <Shield size={20} />
            <span>Admin Panel</span>
          </NavLink>
        )}

      </nav>

      <div className="sidebar-user">

        <div className="sidebar-user-info">
          <strong>
            {profile?.full_name || "User"}
          </strong>

          <span>
            {user?.email}
          </span>
        </div>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;