import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { loginWithEmail } from "../services/authService";
import AuthLayout from "../components/layout/AuthLayout";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If RegisterPage navigates here with { state: { registered: true } }
  const justRegistered = location.state?.registered === true;

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Fixed explicit redirects that match App.jsx paths
  const redirectByRole = (role) => {
    switch (role) {
      case "ADMIN":
        navigate("/admin/dashboard");
        break;
      case "FACULTY_ADVISER":
        navigate("/adviser/dashboard");
        break;
      case "STUDENT_REP":
        navigate("/student/dashboard");
        break;
      default:
        navigate("/login");
        break;
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginWithEmail(formData);
      const user = await login(res.token, res.user);
      console.log("Logged in user:", user);

      if (!user.isProfileComplete) return navigate("/complete-profile");
      if (user.accountStatus === "PENDING")
        return navigate("/pending-approval");
      redirectByRole(user.role);
    } catch (err) {
      setError(err.response?.data || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (cred) => {
    setError("");
    setLoading(true);
    try {
      const user = await login(cred.credential);
      if (!user.isProfileComplete) return navigate("/complete-profile");
      if (user.accountStatus === "PENDING")
        return navigate("/pending-approval");
      redirectByRole(user.role);
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthLayout
        title="Sign In"
        subtitle="Welcome back! Please enter your credentials."
      >
        <div className="login-header">
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            Sign In
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Welcome back! Please enter your credentials.
          </p>
        </div>

        {/* ✅ Success banner after registering */}
        {justRegistered && (
          <div className="success-message">
            Account created successfully. Please sign in to continue.
          </div>
        )}

        {/* Existing error banner */}
        {error && <div className="error-message">{error}</div>}

        {/* form markup untouched (same classes) */}
        <form onSubmit={handleEmailLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group-last">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">OR CONTINUE WITH</span>
          <div className="divider-line"></div>
        </div>

        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google sign-in failed.")}
          text="signin_with"
        />

        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="auth-footer-link"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="help-text">
          <p>Only authorized users can access this system.</p>
          <p>Need help? Contact the IT Department.</p>
        </div>
      </AuthLayout>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
