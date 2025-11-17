import { useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import "./AuthLayout.css";

export function AuthLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  return (
    <div className="auth-layout-container">
      {/* Left Side - Branding */}
      <div className="auth-layout-left">
        <div className="auth-layout-blur-1" />
        <div className="auth-layout-blur-2" />

        <div className="auth-layout-left-content">
          <div className="auth-layout-left-logo">
            <Logo />
          </div>

          <h1 className="auth-layout-left-title">
            Manage your consultations,{" "}
            <span className="auth-layout-left-title-accent">made easy</span>
          </h1>

          <p className="auth-layout-left-text">
            Easily see adviser availability, request a slot, and keep track of
            all your consultations in one place.
          </p>
        </div>

        <div className="auth-layout-stats">
          <div>
            <div className="auth-layout-stat-number">Real-time</div>
            <div className="auth-layout-stat-label">Adviser Schedules</div>
          </div>
          <div>
            <div className="auth-layout-stat-number">No Overlaps</div>
            <div className="auth-layout-stat-label">Conflict-Free Booking</div>
          </div>
          <div>
            <div className="auth-layout-stat-number">Centralized</div>
            <div className="auth-layout-stat-label">Consultation Records</div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-layout-right">
        <div className="auth-layout-content">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="auth-layout-back-btn"
          >
            ← Back to Home
          </button>
          {/* Mobile logo */}
          <div className="auth-layout-mobile-logo">
            <Logo />
            <span>ThesisHub</span>
          </div>

          <div className="auth-layout-header">
            <h2 className="auth-layout-title">{title}</h2>
            <p className="auth-layout-subtitle">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
