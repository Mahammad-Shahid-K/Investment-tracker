import { useState } from "react";
import {
  Settings as SettingsIcon,
  Trash2,
  LogOut,
} from "lucide-react";

import { supabase } from "../lib/supabase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Settings() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [currency, setCurrency] = useState("INR");
  const [darkMode, setDarkMode] = useState(false);

  const clearData = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all your investment data?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("investments")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      alert(`Failed to clear data: ${error.message}`);
      return;
    }

    alert("All your investment data has been deleted.");
  };

  const logout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div>

      <div className="topbar">
        <h1>Settings</h1>
        <p>Manage your portfolio preferences.</p>
      </div>

      <div className="settings-container">

        <div className="settings-section">

          <div className="settings-heading">
            <SettingsIcon size={22} />

            <div>
              <h2>Account</h2>
              <p>Your InvestTrack account information.</p>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Name</strong>
              <p>{profile?.full_name || "Not provided"}</p>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Email</strong>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Account Type</strong>
              <p>
                {profile?.role === "admin"
                  ? "Administrator"
                  : "Standard User"}
              </p>
            </div>
          </div>

        </div>

        <div className="settings-section">

          <div className="settings-heading">
            <SettingsIcon size={22} />

            <div>
              <h2>General Settings</h2>
              <p>Customize your portfolio tracker.</p>
            </div>
          </div>

          <div className="setting-row">

            <div>
              <strong>Currency</strong>
              <p>Select your portfolio currency.</p>
            </div>

            <select
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value)
              }
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>

          </div>

          <div className="setting-row">

            <div>
              <strong>Dark Mode</strong>
              <p>Change the application appearance.</p>
            </div>

            <button
              className={
                darkMode
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                setDarkMode(!darkMode)
              }
            >
              <span></span>
            </button>

          </div>

        </div>

        <div className="settings-section danger-section">

          <div className="settings-heading">
            <Trash2 size={22} />

            <div>
              <h2>Data Management</h2>
              <p>
                Delete all investments belonging to
                your account.
              </p>
            </div>
          </div>

          <button
            className="danger-btn"
            onClick={clearData}
          >
            <Trash2 size={17} />
            Clear My Investment Data
          </button>

        </div>

        <div className="settings-section">

          <button
            className="danger-btn"
            onClick={logout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

        <div className="settings-footer">
          <span>InvestTrack Portfolio Manager</span>
          <span>Version 2.0.0</span>
        </div>

      </div>

    </div>
  );
}

export default Settings;