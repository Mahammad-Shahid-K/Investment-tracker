import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Password reset instructions have been sent to your email."
      );
    }

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
          <h1>Forgot Password?</h1>
          <p>
            Enter your email and we'll send you a password
            reset link.
          </p>
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

          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            <Mail size={18} />

            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

        <div className="auth-footer">
          <Link to="/login">
            <ArrowLeft size={15} />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;