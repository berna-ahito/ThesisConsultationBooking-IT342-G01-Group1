import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-avatar">{user?.name ? user.name.charAt(0) : "U"}</div>
        <div className="profile-info">
          <div className="profile-name">{user?.name || "User Name"}</div>
          <div className="profile-manage">Manage Profile</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/student/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Overview</NavLink>
        <NavLink to="/student/consultations" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Consultations</NavLink>
        <NavLink to="/student/schedule" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Schedule</NavLink>
        <NavLink to="/student/documents" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Documents</NavLink>
        <NavLink to="/student/messages" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Messages</NavLink>
        <NavLink to="/student/settings" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Settings</NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/student/profile" className="nav-item small">Profile</NavLink>
      </div>
    </aside>
  );
}
