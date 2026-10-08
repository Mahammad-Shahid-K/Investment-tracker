import { useEffect, useState } from "react";
import {
  Users,
  BriefcaseBusiness,
  IndianRupee,
  TrendingUp,
  UserCog,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import "./Admin.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    activeUsers: 0,
    investments: 0,
    invested: 0,
    current: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const { data: users } = await supabase
        .from("profiles")
        .select("id, is_active");

      const { data: investments } = await supabase
        .from("investments")
        .select(
          "id, invested_amount, current_value"
        );

      const totalInvested =
        investments?.reduce(
          (sum, item) =>
            sum + Number(item.invested_amount || 0),
          0
        ) || 0;

      const totalCurrent =
        investments?.reduce(
          (sum, item) =>
            sum + Number(item.current_value || 0),
          0
        ) || 0;

      setStats({
        users: users?.length || 0,
        activeUsers:
          users?.filter((user) => user.is_active).length || 0,
        investments: investments?.length || 0,
        invested: totalInvested,
        current: totalCurrent,
      });
    };

    loadStats();
  }, []);

  const profit = stats.current - stats.invested;

  return (
    <div>

      <div className="topbar">
        <h1>Admin Dashboard</h1>
        <p>Manage the entire InvestTrack platform.</p>
      </div>

      <div className="admin-grid">

        <div className="admin-card">
          <Users />
          <span>Total Users</span>
          <strong>{stats.users}</strong>
        </div>

        <div className="admin-card">
          <UserCog />
          <span>Active Users</span>
          <strong>{stats.activeUsers}</strong>
        </div>

        <div className="admin-card">
          <BriefcaseBusiness />
          <span>Total Investments</span>
          <strong>{stats.investments}</strong>
        </div>

        <div className="admin-card">
          <IndianRupee />
          <span>Total Invested</span>
          <strong>
            ₹{stats.invested.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="admin-card">
          <TrendingUp />
          <span>Total Portfolio Value</span>
          <strong>
            ₹{stats.current.toLocaleString("en-IN")}
          </strong>
        </div>

      </div>

      <div className="admin-profit">
        <h2>Platform Profit/Loss</h2>

        <strong className={profit >= 0 ? "profit" : "loss"}>
          {profit >= 0 ? "+" : "-"}₹
          {Math.abs(profit).toLocaleString("en-IN")}
        </strong>
      </div>

      <div className="admin-links">

        <Link to="/admin/users">
          <Users />
          Manage Users
        </Link>

        <Link to="/admin/investments">
          <BriefcaseBusiness />
          View Investments
        </Link>

      </div>

    </div>
  );
}

export default AdminDashboard;