import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", data.user.id)
        .single();

      if (profile?.is_active === false) {
        await supabase.auth.signOut();
        setError("Your account has been deactivated by an administrator.");
        setLoading(false);
        return;
      }

      if (profile?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
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
          <h1>Welcome Back</h1>
          <p>Sign in to manage your investment portfolio.</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot-link">
            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            <LogIn size={18} />

            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?

          <Link to="/signup">
            Create account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;