import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import NotificationBell from "../notifications/NotificationBell"; // ✅ COMMENT OUT
import "./DashboardHeader.css";
import { GraduationIcon } from "../common/icons/HeaderIcons";

const DashboardHeader = ({
  title = "Thesis Consultation Booking",
  subtitle,
  icon = null,
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

  // Default icon is GraduationIcon if none provided
  const iconToDisplay = icon || <GraduationIcon />;

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-left">
          <div className="header-logo">{iconToDisplay}</div>
          <div className="header-text">
            <h1 className="header-title">{title}</h1>
            {subtitle && <p className="header-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="header-right">
          {/* ✅ COMMENT OUT NOTIFICATION BELL */}
          {/* <NotificationBell /> */}

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
