import { useState } from "react";
import {
  Settings as SettingsIcon,
  Moon,
  IndianRupee,
  Trash2,
} from "lucide-react";

function Settings() {
  const [currency, setCurrency] = useState("INR");
  const [darkMode, setDarkMode] = useState(false);

  const clearData = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to delete all investment data?"
    );

    if (confirmClear) {
      localStorage.removeItem("investments");
      window.location.reload();
    }
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
              <option value="INR">
                INR (₹)
              </option>

              <option value="USD">
                USD ($)
              </option>

              <option value="EUR">
                EUR (€)
              </option>
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
                Manage your locally stored portfolio data.
              </p>
            </div>
          </div>

          <button
            className="danger-btn"
            onClick={clearData}
          >
            <Trash2 size={17} />
            Clear All Investment Data
          </button>
        </div>

        <div className="settings-footer">
          <Moon size={18} />
          <span>
            InvestTrack Portfolio Manager
          </span>
          <span>Version 1.0.0</span>
        </div>

      </div>
    </div>
  );
}

export default Settings;