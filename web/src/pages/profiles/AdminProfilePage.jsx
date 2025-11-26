import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deactivateMyAccount,
} from "../../services/userService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardHeader from "../../components/layout/DashboardHeader";
import Alert from "../../components/common/Alert";
import FormInput from "../../components/common/FormInput";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { UserIcon } from "../../components/common/icons/HeaderIcons";
import "./ProfileCommon.css";
import "./AdminProfilePage.css";

const AdminProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await getProfile();
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
      });
      setAvatarPreview(profile.pictureUrl || "");
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (
      window.confirm(
        "⚠️ Are you sure you want to deactivate your account? You will be logged out and cannot access the system until reactivated by an administrator."
      )
    ) {
      try {
        setError("");
        setSaving(true);
        await deactivateMyAccount();
        alert("Account deactivated successfully. You will be logged out.");
        localStorage.clear();
        window.location.href = "/login";
      } catch {
        setError("Failed to deactivate account");
        setSaving(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const updatedProfile = await uploadProfileImage(selectedFile);
      updateUser(updatedProfile);
      setSuccess("Profile photo updated!");
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setError("Failed to upload profile photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name) {
      setError("Name is required");
      return;
    }

    setSaving(true);

    try {
      const updatedProfile = await updateProfile({
        name: formData.name,
      });

      updateUser(updatedProfile);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to update profile");
    } finally {
      setSaving(false);
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
      <DashboardHeader
        title="My Profile"
        subtitle="Manage your account information"
        icon={<UserIcon />}
      />

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {avatarPreview || user?.pictureUrl ? (
                <img
                  src={avatarPreview || user.pictureUrl}
                  alt={formData.name}
                />
              ) : (
                <div className="avatar-placeholder">
                  {formData.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>

            <div className="profile-info">
              <h2>{formData.name}</h2>
              <p className="profile-email">{formData.email}</p>
              <span className="profile-role-badge">Administrator</span>
            </div>

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
            <Alert type="error" message={error} onClose={() => setError("")} />
          )}
          {success && (
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess("")}
            />
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>

              <FormInput
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={saving}
                required
              />

              <FormInput
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                disabled={true}
                hint="Email cannot be changed (linked to Google account)"
              />
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                loading={saving}
                fullWidth
              >
                Save Changes
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleDeactivateAccount}
                disabled={saving}
                style={{
                  marginTop: "10px",
                  backgroundColor: "#dc3545",
                  borderColor: "#dc3545",
                }}
              >
                Deactivate My Account
              </Button>
            </div>
          </form>
        </div>

        <div className="profile-sidebar">
          <div className="info-card">
            <h3>Account Status</h3>
            <div className="status-item">
              <span className="status-label">Status: </span>
              <span className="status-badge active">Active</span>
            </div>
            <div className="status-item">
              <span className="status-label">Role: </span>
              <span>Administrator</span>
            </div>
            <div className="status-item">
              <span className="status-label">System Access: </span>
              <span className="access-level">Full</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfilePage;
