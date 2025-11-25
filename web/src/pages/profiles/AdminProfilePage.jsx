import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile, uploadProfileImage } from "../../services/userService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardHeader from "../../components/layout/DashboardHeader";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { UserIcon } from "../../components/common/icons/HeaderIcons";
import "./ProfileCommon.css";
import "./AdminProfilePage.css";

const AdminProfilePage = () => {
  /* eslint-disable no-unused-vars */
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Avatar upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const updated = await uploadProfileImage(selectedFile);
      updateUser(updated);
      setProfile(updated);
      setSuccess("Profile photo updated!");
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setError("Failed to upload profile photo");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="admin-profile-page">
        <DashboardHeader
          title="Administrator Profile"
          subtitle="View and manage your account information"
          icon={<UserIcon />}
        />

        <div className="profile-container">
          {/* LEFT SIDE CARD */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {avatarPreview || profile?.pictureUrl ? (
                  <img
                    src={avatarPreview || profile.pictureUrl}
                    alt={profile?.name}
                  />
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

              {/* Avatar actions */}
              <div className="profile-avatar-actions">
                <label className="upload-avatar-label">
                  Change photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                </label>

                {selectedFile && (
                  <Button
                    type="button"
                    variant="secondary"
                    loading={uploading}
                    onClick={handleAvatarUpload}
                  >
                    Save Photo
                  </Button>
                )}
              </div>
            </div>

            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            )}
            {success && (
              <Alert
                type="success"
                message={success}
                onClose={() => setSuccess("")}
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
                  support if you need to change account details.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE SIDEBAR */}
          <div className="profile-sidebar">
            <div className="info-card">
              <h3>System Access</h3>
              <div className="access-list">
                <div className="access-item">
                  <span className="access-icon">✓</span>Manage Users
                </div>
                <div className="access-item">
                  <span className="access-icon">✓</span>Approve Faculty
                </div>
                <div className="access-item">
                  <span className="access-icon">✓</span>View Reports
                </div>
                <div className="access-item">
                  <span className="access-icon">✓</span>System Settings
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
