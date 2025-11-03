import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./DashboardHeader.css";

const DashboardHeader = ({
  title = "Thesis Consultation Booking",
  subtitle,
  icon = "🎓",
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleDisplay = () => {
    switch (user?.role) {
      case "STUDENT_REP":
        return "Student";
      case "FACULTY_ADVISER":
        return "Faculty Adviser";
      case "ADMIN":
        return "Administrator";
      default:
        return "User";
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-left">
          <div className="header-logo">{icon}</div>
          <div className="header-text">
            <h1 className="header-title">{title}</h1>
            {subtitle && <p className="header-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{getRoleDisplay()}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
