import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../../services/userService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardHeader from "../../components/layout/DashboardHeader";
import Alert from "../../components/common/Alert";
import FormInput from "../../components/common/FormInput";
import Button from "../../components/common/Button";
import "./ProfileCommon.css";
import "./StudentProfilePage.css";

const StudentProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    teamCode: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await getProfile();
      setFormData({
        name: profile.name || "",
        studentId: profile.studentId || "",
        teamCode: profile.teamCode || "",
        email: profile.email || "",
      });
      setAvatarPreview(profile.pictureUrl || null);
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "teamCode") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const updatedProfile = await uploadProfileImage(selectedFile);
      updateUser(updatedProfile);
      setSuccess("Profile photo updated successfully!");
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

    if (!formData.name || !formData.studentId || !formData.teamCode) {
      setError("All fields are required");
      return;
    }

    if (!/^TEAM-\d{2}$/.test(formData.teamCode)) {
      setError("Team code must follow format TEAM-XX (e.g., TEAM-01)");
      return;
    }

    setSaving(true);

    try {
      const updatedProfile = await updateProfile({
        name: formData.name,
        studentId: formData.studentId,
        teamCode: formData.teamCode,
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
      <DashboardLayout role="STUDENT_REP">
        <div style={{ padding: "2rem" }}>Loading profile...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="STUDENT_REP">
      <DashboardHeader
        title="My Profile"
        subtitle="Manage your account information"
        icon={null}
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
              <span className="profile-role-badge">Student Representative</span>
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

              <FormInput
                label="Student ID"
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="202012345"
                disabled={true}
                hint="Student ID cannot be changed after registration"
                required
              />

              <FormInput
                label="Team Code"
                type="text"
                name="teamCode"
                value={formData.teamCode}
                onChange={handleChange}
                placeholder="TEAM-01"
                disabled={saving}
                hint="Format: TEAM-XX (e.g., TEAM-01, TEAM-15)"
                required
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
            </div>
          </form>
        </div>

        <div className="profile-sidebar">
          <div className="info-card">
            <h3>Account Status</h3>
            <div className="status-item">
              <span className="status-label">Status:</span>
              <span className="status-badge active">Active</span>
            </div>
            <div className="status-item">
              <span className="status-label">Role:</span>
              <span>Student Representative</span>
            </div>
            <div className="status-item">
              <span className="status-label">Team Code:</span>
              <span className="team-code">
                {formData.teamCode || "Not set"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfilePage;
