import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { register, loginWithGoogle } from "../services/authService";
import AuthLayout from "../components/layout/AuthLayout";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import "./LoginPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Redirect logic (same as LoginPage)
  const handleRedirect = (user) => {
    if (!user.isProfileComplete) {
      navigate("/complete-profile", { replace: true });
      return;
    }

    if (user.role === "FACULTY_ADVISER" && user.accountStatus === "PENDING") {
      navigate("/pending-approval", { replace: true });
      return;
    }

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

  // Email/Password registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      // After successful registration, redirect to login
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth registration (same flow as login)
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

      // Redirect (will go to complete-profile if needed)
      handleRedirect(response.user);
    } catch (err) {
      console.error("Google registration error:", err);
      setError("Google sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-up failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthLayout
        title="Create Account"
        subtitle="Join the Thesis Consultation Booking System"
      >
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="your.email@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Minimum 8 characters"
              disabled={loading}
            />
          </div>

          <div className="form-group-last">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Re-enter password"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">Or continue with</span>
          <div className="divider-line"></div>
        </div>

        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="signup_with"
        />

        <div className="auth-footer">
          <span className="auth-footer-text">Already have an account? </span>
          <Link to="/login" className="auth-footer-link">
            Sign in
          </Link>
        </div>

        <div className="help-text">
          <p>By creating an account, you agree to our Terms of Service.</p>
        </div>
      </AuthLayout>
    </GoogleOAuthProvider>
  );
};

export default RegisterPage;
