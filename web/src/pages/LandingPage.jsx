import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Logo from "../components/common/Logo";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="nav-logo">
            <Logo />
            <span className="logo-text">ThesisHub</span>
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
            <span className="badge-icon">⭐</span>
            <span className="badge-text">
              Used by IT students for seamless scheduling
            </span>
          </div>

          <h1 className="hero-title">
            Simplify Your{" "}
            <span className="gradient-text">Consultation Booking</span>
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

          <div className="hero-features">
            <div className="hero-feature-item"></div>
            <div className="hero-feature-item"></div>
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
          <div className="cta-bg-blur cta-blur-1" />
          <div className="cta-bg-blur cta-blur-2" />
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
    icon: "📅",
    title: "Real-Time Scheduling",
    description:
      "See adviser availability instantly and request consultation slots without the back-and-forth.",
  },
  {
    icon: "🔔",
    title: "Status Notifications",
    description:
      "Get notified when your consultation is approved, rejected, or updated by your adviser.",
  },
  {
    icon: "📝",
    title: "Consultation Records",
    description:
      "Access your full consultation history, including session details, remarks, and status updates.",
  },
  {
    icon: "👨‍🏫",
    title: "Adviser Management",
    description:
      "Faculty advisers can manage their schedules, approve requests, and log consultation notes.",
  },
  {
    icon: "📊",
    title: "Admin Monitoring",
    description:
      "Department admins can view all bookings and generate simple consultation reports.",
  },
  {
    icon: "🔒",
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
      "Check open consultation slots based on your adviser’s schedule.",
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
