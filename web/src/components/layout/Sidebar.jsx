// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoIcon from "../../assets/Icon_Prototype.png";
import "./Sidebar.css";

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
        fill="currentColor"
      />
    </svg>
  ),
  book: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 19h14V5H4v14zm0 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H4C2.9 3 2 3.9 2 5v14c0 1.1.9 2 2 2z"
        fill="currentColor"
      />
    </svg>
  ),
  consultations: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill="currentColor"
      />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12c2.67 0 8-1.34 8-4V6c0-2.66-5.33-4-8-4S4 3.34 4 6v2c0 2.66 5.33 4 8 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill="currentColor"
      />
    </svg>
  ),
};

const Sidebar = ({ role }) => {
  const { user, logout } = useAuth();

  let navItems = [];

  let profilePath = "";

  if (role === "STUDENT_REP") {
    navItems = [
      { label: "Dashboard", path: "/student/dashboard", icon: icons.dashboard },
      { label: "Book Consultation", path: "/student/book", icon: icons.book },
      {
        label: "My Consultations",
        path: "/student/consultations",
        icon: icons.consultations,
      },
    ];
    profilePath = "/student/profile";
  }

  if (role === "FACULTY_ADVISER") {
    navItems = [
      { label: "Dashboard", path: "/adviser/dashboard", icon: icons.dashboard },
      {
        label: "View Consultations",
        path: "/adviser/consultations",
        icon: icons.consultations,
      },
      { label: "Pending Requests", path: "/adviser/pending", icon: icons.book },
    ];
    profilePath = "/adviser/profile";
  }

  if (role === "ADMIN") {
    navItems = [
      { label: "Dashboard", path: "/admin/dashboard", icon: icons.dashboard },
      {
        label: "Pending Approvals",
        path: "/admin/approvals",
        icon: icons.book,
      },
      { label: "All Users", path: "/admin/users", icon: icons.consultations },
    ];
    profilePath = "/admin/profile";
  }

  const portalLabel =
    role === "STUDENT_REP"
      ? "Student Portal"
      : role === "FACULTY_ADVISER"
      ? "Faculty Portal"
      : role === "ADMIN"
      ? "Admin Portal"
      : "Portal";

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <img src={LogoIcon} alt="ThesisHub Logo" className="logo-image" />
        </div>
        <div className="logo-info">
          <span className="logo-title">ThesisHub</span>
          <span className="logo-subtitle">{portalLabel}</span>
        </div>
      </div>

      <NavLink
        to={profilePath}
        className={({ isActive }) => `nav-item user-nav ${isActive ? "active" : ""}`}
      >
        <div className="avatar">
          {user?.pictureUrl ? (
            <img src={user.pictureUrl} alt={user?.name || "User avatar"} />
          ) : (
            initials
          )}
        </div>
        <div className="user-text">
          <p className="u-name">{user?.name}</p>
          <p className="u-email">Manage Profile</p>
        </div>
      </NavLink>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
