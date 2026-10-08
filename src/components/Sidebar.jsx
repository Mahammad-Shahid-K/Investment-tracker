import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  BarChart3,
  Settings,
  TrendingUp,
} from "lucide-react";

function Sidebar() {
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
      </nav>
    </aside>
  );
}

export default Sidebar;