import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Logo from "../components/common/Logo";
import "./LandingPage.css";

// SVG Icons
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="nav-logo">
            <Logo />
          </div>

          <div className="nav-actions">
            <button
              onClick={() => navigate("/login")}
              className="nav-login-btn"
            >
              Login
            </button>
            <Button onClick={() => navigate("/register")}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">
              <StarIcon />
            </span>
            <span className="badge-text">
              Used by IT students for seamless scheduling
            </span>
          </div>

          <h1 className="hero-title">
            Simplify Your{" "}
            <span className="hero-gradient-text">Consultation Booking</span>
          </h1>

          <p className="hero-subtitle">
            Check adviser availability, request consultation slots, and track
            your booking status - all in one place.
          </p>

          <div className="hero-buttons">
            <Button size="lg" onClick={() => navigate("/register")}>
              Get Started
            </Button>
            <button
              onClick={() => navigate("/login")}
              className="hero-signin-btn"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything you need to succeed</h2>
          <p className="section-subtitle">
            Powerful features designed to streamline your thesis consultation
            process
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <span className="icon">{feature.icon}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="steps-section">
        <div className="section-header">
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">
            Get started in just a few simple steps
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              {index < steps.length - 1 && <div className="step-connector" />}
              <div className="step-number">{index + 1}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to streamline your thesis journey?
            </h2>
            <p className="cta-subtitle">
              Start scheduling your consultations the easier way — organized,
              conflict-free, and accessible anywhere.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="cta-button"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2025 ThesisHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: <CalendarIcon />,
    title: "Real-Time Scheduling",
    description:
      "See adviser availability instantly and request consultation slots without the back-and-forth.",
  },
  {
    icon: <BellIcon />,
    title: "Status Notifications",
    description:
      "Get notified when your consultation is approved, rejected, or updated by your adviser.",
  },
  {
    icon: <DocumentIcon />,
    title: "Consultation Records",
    description:
      "Access your full consultation history, including session details, remarks, and status updates.",
  },
  {
    icon: <UserIcon />,
    title: "Adviser Management",
    description:
      "Faculty advisers can manage their schedules, approve requests, and log consultation notes.",
  },
  {
    icon: <ChartIcon />,
    title: "Admin Monitoring",
    description:
      "Department admins can view all bookings and generate simple consultation reports.",
  },
  {
    icon: <ShieldIcon />,
    title: "Secure Login",
    description:
      "Protected with Google OAuth 2.0 and role-based access for Students, Advisers, and Admins.",
  },
];

const steps = [
  {
    title: "Sign in with Google",
    description: "Log in securely using your institutional Google account.",
  },
  {
    title: "View Adviser Availability",
    description:
      "Check open consultation slots based on your adviser's schedule.",
  },
  {
    title: "Submit a Booking Request",
    description: "Choose a preferred time and wait for adviser approval.",
  },
  {
    title: "Attend & Track Your Sessions",
    description:
      "Receive updates, view session notes, and keep your consultation history organized.",
  },
];

export default LandingPage;
