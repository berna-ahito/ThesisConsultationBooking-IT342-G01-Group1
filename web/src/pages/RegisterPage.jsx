import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { register } from "../services/authService";
import AuthLayout from "../components/layout/AuthLayout";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import "./LoginPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
        role: formData.role || undefined,
      });

      // ✅ new: go to login after successful registration
      setLoading(false);
      navigate("/login", { replace: true, state: { registered: true } });
      return;
    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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

          {/* optional: role dropdown (kept commented for now)
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            >
              <option value="">Select your role</option>
              <option value="STUDENT_REP">Student Representative</option>
              <option value="FACULTY_ADVISER">Faculty Adviser</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
          */}

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
          onSuccess={(cred) => console.log("Google Success", cred)}
          onError={() => setError("Google Sign-In failed")}
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
