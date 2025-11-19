import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import "../pages/CompleteProfile.css";

const PendingApprovalPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="complete-profile-container">
      <div className="complete-profile-card">
        <div className="profile-header">
          <img src="/logo.png" alt="CIT-U Logo" className="logo" />
          <h1 className="gradient-text">Account Pending Approval</h1>
          <p className="subtitle">Hi, {user?.name}!</p>
        </div>
        <div className="approval-notice" style={{ marginBottom: "24px" }}>
          <span className="notice-icon">⏳</span>
          <div>
            <strong>Your account is awaiting approval</strong>
            <p>
              Your {user?.role === "PENDING" ? "faculty/admin" : ""} account
              requires verification by the IT Department before you can access
              the system.
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h3 style={{ color: "#0f172a", marginBottom: "12px" }}>
            What happens next?
          </h3>
          <ul style={{ textAlign: "left", color: "#666", lineHeight: "1.8" }}>
            <li>The IT Department will review your account details</li>
            <li>You will receive an email notification once approved</li>
            <li>Typical approval time: 1-2 business days</li>
          </ul>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "24px",
            background: "#f5f5f5",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <p
            style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#2c2c2c" }}
          >
            Need immediate access?
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
            Contact the IT Department at:
            <br />
            <a
              href="mailto:itdept@gmail.com"
              style={{ color: "#06b6d4", textDecoration: "underline" }}
            >
              itdept@gmail.com
            </a>
          </p>
        </div>

        <Button variant="primary" onClick={handleLogout} fullWidth>
          Sign Out
        </Button>

        <div className="profile-footer">
          <p>
            Thank you for your patience. We'll notify you as soon as your
            account is ready!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
