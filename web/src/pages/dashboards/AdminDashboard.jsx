import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadStats();
    loadPendingUsers();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get("/admin/users/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users/pending");
      setPendingUsers(response.data);
    } catch (err) {
      setError("Failed to load pending users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users");
      setAllUsers(response.data);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm("Are you sure you want to approve this user?")) {
      return;
    }

    try {
      await api.post(`/admin/users/${userId}/approve`);
      setSuccessMessage("User approved successfully!");

      // Reload data
      loadStats();
      loadPendingUsers();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to approve user");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleReject = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to reject this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.post(`/admin/users/${userId}/reject`);
      setSuccessMessage("User rejected successfully");

      // Reload data
      loadStats();
      loadPendingUsers();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reject user");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "users" && allUsers.length === 0) {
      loadAllUsers();
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">⚙️</span>
            <div>
              <h1>Admin Dashboard</h1>
              <p>Thesis Consultation Booking System</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">Administrator</span>
          </div>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav">
        <button
          className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => handleTabChange("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`nav-tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => handleTabChange("pending")}
        >
          ⏳ Pending Approvals
          {pendingUsers.length > 0 && (
            <span className="badge">{pendingUsers.length}</span>
          )}
        </button>
        <button
          className={`nav-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => handleTabChange("users")}
        >
          👥 All Users
        </button>
      </nav>

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {/* Content */}
      <main className="admin-content">
        {activeTab === "overview" && (
          <div className="overview-section">
            <h2>System Statistics</h2>
            {stats ? (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <p className="stat-label">Total Users</p>
                    <p className="stat-value">{stats.totalUsers}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <p className="stat-label">Active Users</p>
                    <p className="stat-value">{stats.activeUsers}</p>
                  </div>
                </div>
                <div className="stat-card highlight">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <p className="stat-label">Pending Approval</p>
                    <p className="stat-value">{stats.pendingUsers}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎓</div>
                  <div className="stat-info">
                    <p className="stat-label">Students</p>
                    <p className="stat-value">{stats.students}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👨‍🏫</div>
                  <div className="stat-info">
                    <p className="stat-label">Faculty Advisers</p>
                    <p className="stat-value">{stats.faculty}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⚙️</div>
                  <div className="stat-info">
                    <p className="stat-label">Admins</p>
                    <p className="stat-value">{stats.admins}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading statistics...</p>
            )}
          </div>
        )}

        {activeTab === "pending" && (
          <div className="pending-section">
            <h2>Pending User Approvals</h2>
            {loading ? (
              <p>Loading pending users...</p>
            ) : pendingUsers.length === 0 ? (
              <div className="empty-state">
                <p>🎉 No pending approvals!</p>
                <p>All users have been reviewed.</p>
              </div>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((pendingUser) => (
                      <tr key={pendingUser.id}>
                        <td>
                          <div className="user-cell">
                            {pendingUser.pictureUrl && (
                              <img
                                src={pendingUser.pictureUrl}
                                alt={pendingUser.name}
                                className="user-avatar"
                              />
                            )}
                            <span>{pendingUser.name}</span>
                          </div>
                        </td>
                        <td>{pendingUser.email}</td>
                        <td>
                          <span className="role-badge">{pendingUser.role}</span>
                        </td>
                        <td>{pendingUser.department || "—"}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleApprove(pendingUser.id)}
                              className="btn-approve"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleReject(pendingUser.id)}
                              className="btn-reject"
                            >
                              ✗ Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-section">
            <h2>All Users</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Student ID</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="user-cell">
                            {u.pictureUrl && (
                              <img
                                src={u.pictureUrl}
                                alt={u.name}
                                className="user-avatar"
                              />
                            )}
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className="role-badge">{u.role}</span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              u.accountStatus === "ACTIVE"
                                ? "active"
                                : "pending"
                            }`}
                          >
                            {u.accountStatus}
                          </span>
                        </td>
                        <td>{u.studentId || "—"}</td>
                        <td>{u.department || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
