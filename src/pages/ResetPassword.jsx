import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import "./Auth.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully.");

    setTimeout(() => {
      navigate("/login");
    }, 1500);

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <TrendingUp size={32} />
          <span>InvestTrack</span>
        </div>

        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Create your new password.</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {message && (
          <div className="auth-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>New Password</label>

          <input
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            <Lock size={18} />

            {loading
              ? "Updating..."
              : "Update Password"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default ResetPassword;