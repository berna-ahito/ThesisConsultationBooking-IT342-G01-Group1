import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      const user = await login(credentialResponse.credential);

      // Redirect based on role
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "FACULTY_ADVISER") {
        navigate("/adviser/dashboard");
      } else if (user.role === "STUDENT_REP") {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Login failed. Please try again or contact the IT Department.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In failed. Please try again.");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo/Header */}
        <div style={{ marginBottom: "20px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Thesis Consultation Booking
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            IT Department - CIT University
          </p>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Description */}
        <p style={{ marginBottom: "30px", color: "#374151" }}>
          Sign in with your institutional Google account to access the
          consultation booking system.
        </p>

        {/* Google Login Button */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        )}

        {/* Footer */}
        <div style={{ marginTop: "30px", fontSize: "12px", color: "#9ca3af" }}>
          <p>Only authorized CIT users can access this system.</p>
          <p style={{ marginTop: "8px" }}>
            Need help? Contact the IT Department.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
