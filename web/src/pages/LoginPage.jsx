import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { loginWithEmail, loginWithGoogle } from "../services/authService";
import AuthLayout from "../components/layout/AuthLayout";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const justRegistered = location.state?.registered === true;
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Redirect logic based on user state
  const handleRedirect = (user) => {
    // Check if profile is incomplete
    if (!user.isProfileComplete) {
      navigate("/complete-profile", { replace: true });
      return;
    }

    // Check if pending approval (Faculty only)
    if (user.role === "FACULTY_ADVISER" && user.accountStatus === "PENDING") {
      navigate("/pending-approval", { replace: true });
      return;
    }

    // Redirect to dashboard based on role
    switch (user.role) {
      case "ADMIN":
        navigate("/admin/dashboard", { replace: true });
        break;
      case "FACULTY_ADVISER":
        navigate("/adviser/dashboard", { replace: true });
        break;
      case "STUDENT_REP":
        navigate("/student/dashboard", { replace: true });
        break;
      default:
        navigate("/login", { replace: true });
        break;
    }
  };

  // Email/Password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginWithEmail(formData);

      // Save to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Update context
      updateUser(response.user);

      // Redirect
      handleRedirect(response.user);
    } catch (err) {
      console.error("Email login error:", err);
      const msg = err.response?.data;

      if (msg === "ACCOUNT_DEACTIVATED" || msg?.includes("deactivated")) {
        setError(
          "Your account has been deactivated. Please contact the administrator."
        );
      } else if (msg?.includes("Invalid credentials")) {
        setError("Incorrect email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth login
  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      const response = await loginWithGoogle(credentialResponse.credential);

      // Save to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Update context
      updateUser(response.user);

      // Redirect
      handleRedirect(response.user);
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in failed. Please try again.");
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
          ></h2>
        </div>

        {justRegistered && (
          <div className="success-message">
            Account created successfully. Please sign in to continue.
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

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
          onError={handleGoogleError}
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
