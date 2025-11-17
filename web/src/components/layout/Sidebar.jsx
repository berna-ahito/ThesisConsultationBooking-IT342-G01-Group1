import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ role }) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const studentNav = [
    { path: "/student/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/student/book", icon: "📅", label: "Book Consultation" },
    { path: "/student/consultations", icon: "📚", label: "My Consultations" },
    { path: "/student/profile", icon: "👤", label: "Profile" },
  ];

  const facultyNav = [
    { path: "/adviser/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/adviser/pending", icon: "📬", label: "Pending Requests" },
    { path: "/adviser/consultations", icon: "📋", label: "My Consultations" },
    { path: "/adviser/profile", icon: "👤", label: "Profile" },
  ];

  const adminNav = [
    { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/admin/approvals", icon: "👨‍🏫", label: "Pending Approvals" },
    { path: "/admin/users", icon: "👥", label: "All Users" },
    { path: "/admin/profile", icon: "👤", label: "Profile" },
  ];

  const navItems =
    role === "STUDENT_REP"
      ? studentNav
      : role === "FACULTY_ADVISER"
      ? facultyNav
      : adminNav;

  const roleLabel =
    role === "STUDENT_REP"
      ? "Student Portal"
      : role === "FACULTY_ADVISER"
      ? "Faculty Portal"
      : "Admin Portal";

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? "→" : "←"}
      </button>

      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">📚</div>
          {!isCollapsed && (
            <div className="logo-text">
              <h2>ThesisHub</h2>
              <p>{roleLabel}</p>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            title={isCollapsed ? item.label : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.pictureUrl ? (
              <img src={user.pictureUrl} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <p className="user-name">{user?.name}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          )}
        </div>
        <button onClick={logout} className="logout-btn">
          <span>🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
