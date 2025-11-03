import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { completeProfile } from "../services/authService";
import "./CompleteProfile.css";
import Alert from "../components/common/Alert";
import NoticeBox from "../components/common/NoticeBox";
import FormInput from "../components/common/FormInput";
import Button from "../components/common/Button";

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    role: "STUDENT_REP",
    studentId: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("🚀 Form submitted!");

    if (formData.role === "STUDENT_REP" && !formData.studentId) {
      setError("Student ID is required");
      return;
    }

    if (formData.role === "FACULTY_ADVISER" && !formData.department) {
      setError("Department is required");
      return;
    }

    setLoading(true);

    try {
      console.log("📡 Calling completeProfile API...");
      const response = await completeProfile(formData);
      console.log("✅ API Success! Full Response:", response);
      console.log("✅ User from response:", response.user);

      const updatedUser = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        pictureUrl: response.user.pictureUrl || null,
        role: response.user.role,
        isProfileComplete: response.user.isProfileComplete,
        studentId: response.user.studentId || null,
        department: response.user.department || null,
      };

      console.log("💾 Saving updated user:", updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("token", response.token);

      console.log("✅ Saved to localStorage!");
      console.log(
        "✅ localStorage user:",
        JSON.parse(localStorage.getItem("user"))
      );

      updateUser(updatedUser);

      console.log("🧭 User role:", updatedUser.role);

      await new Promise((resolve) => setTimeout(resolve, 300));

      if (updatedUser.role === "STUDENT_REP") {
        console.log("🎓 Navigating to student dashboard...");
        navigate("/student/dashboard", { replace: true });
      } else if (updatedUser.role === "ADMIN") {
        console.log("⚙️ Navigating to admin dashboard...");
        navigate("/admin/dashboard", { replace: true });
      } else if (updatedUser.role === "FACULTY_ADVISER") {
        console.log("👨‍🏫 Navigating to pending approval...");
        navigate("/pending-approval", { replace: true });
      } else {
        console.warn("⚠️ Unknown role:", updatedUser.role);
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("❌ Complete profile error:", err);
      setError(
        err.response?.data || err.message || "Failed to complete profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requiresApproval = formData.role === "FACULTY_ADVISER";

  return (
    <div className="complete-profile-container">
      <div className="complete-profile-card">
        <div className="profile-header">
          <img src="/logo.png" alt="Logo" className="logo" />
          <h1 className="gradient-text">Complete Your Profile</h1>
          <p className="subtitle">
            Welcome, {user?.name}! Tell us more about yourself.
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <FormInput
            label="I am a..."
            type="select"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="STUDENT_REP">Student Representative</option>
            <option value="FACULTY_ADVISER">Faculty Adviser</option>
          </FormInput>

          {formData.role === "STUDENT_REP" && (
            <FormInput
              label="Student ID"
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="202012345"
              disabled={loading}
              hint="Enter your university student ID number"
              required
            />
          )}

          {formData.role === "FACULTY_ADVISER" && (
            <FormInput
              label="Department"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="IT Department"
              disabled={loading}
              hint="Which department are you advising in?"
              required
            />
          )}

          {formData.role === "ADMIN" && (
            <NoticeBox
              type="info"
              icon="⚙️"
              title="Department Administrator"
              message="As an admin, you'll have full access to manage users, approve faculty accounts, and oversee consultations."
            />
          )}

          {requiresApproval && (
            <NoticeBox
              type="warning"
              icon="⚠️"
              title="Approval Required"
              message="Faculty adviser accounts require IT Department admin approval. You will be notified via email once your account is activated."
            />
          )}

          <Button type="submit" variant="primary" loading={loading} fullWidth>
            Complete Profile
          </Button>
        </form>

        <div className="profile-footer">
          <p>
            Your information will be securely stored and used only for system
            access management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
