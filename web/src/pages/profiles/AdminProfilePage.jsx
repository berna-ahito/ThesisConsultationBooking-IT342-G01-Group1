import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../services/userService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardHeader from "../../components/layout/DashboardHeader";
import Alert from "../../components/common/Alert";
import "./AdminProfilePage.css";

const AdminProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        {" "}
        <div style={{ padding: "2rem" }}>Loading profile...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      {" "}
      {/* ✅ WRAP */}
      <div className="admin-profile-page">
        {" "}
        {/* Keep this div */}
        <DashboardHeader
          title="Administrator Profile"
          subtitle="View your account information"
          icon="👤"
        />
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.pictureUrl ? (
                  <img src={user.pictureUrl} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {profile?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2>{profile?.name}</h2>
                <p className="profile-email">{profile?.email}</p>
                <span className="profile-role-badge">Administrator</span>
              </div>
            </div>

            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            )}

            <div className="profile-details">
              <h3>Account Information</h3>

              <div className="detail-row">
                <span className="label">Full Name:</span>
                <span className="value">{profile?.name}</span>
              </div>

              <div className="detail-row">
                <span className="label">Email Address:</span>
                <span className="value">{profile?.email}</span>
              </div>

              <div className="detail-row">
                <span className="label">Role:</span>
                <span className="value">
                  <span className="role-badge">Administrator</span>
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Account Status:</span>
                <span className="value">
                  <span className="status-badge active">Active</span>
                </span>
              </div>

              <div className="info-note">
                <span className="note-icon">ℹ️</span>
                <p>
                  Administrator accounts have full system access. Contact system
                  support if you need to update your profile information.
                </p>
              </div>
            </div>
          </div>

          <div className="profile-sidebar">
            <div className="info-card">
              <h3>System Access</h3>
              <div className="access-list">
                <div className="access-item">
                  <span className="access-icon">✓</span>
                  <span>Manage Users</span>
                </div>
                <div className="access-item">
                  <span className="access-icon">✓</span>
                  <span>Approve Faculty</span>
                </div>
                <div className="access-item">
                  <span className="access-icon">✓</span>
                  <span>View Reports</span>
                </div>
                <div className="access-item">
                  <span className="access-icon">✓</span>
                  <span>System Settings</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Quick Stats</h3>
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-details">
                  <span className="stat-label">Total Users</span>
                  <span className="stat-link">View Dashboard</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⏳</div>
                <div className="stat-details">
                  <span className="stat-label">Pending Approvals</span>
                  <span className="stat-link">Review Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfilePage;
