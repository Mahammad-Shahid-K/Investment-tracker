import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      navigate("/");
    } else {
      setMessage(
        "Account created. Please check your email to verify your account."
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
          <h1>Create Account</h1>
          <p>Start tracking your investments today.</p>
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

        <form onSubmit={handleSignup}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

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
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            <UserPlus size={18} />

            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <div className="auth-footer">
          Already have an account?

          <Link to="/login">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;