import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { completeProfile } from "../services/authService";
import ThesisHubLogo from "../assets/Icon_Prototype.png";
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
    teamCode: "",
    department: "IT Department",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.role === "STUDENT_REP" && !formData.studentId) {
      setError("Student ID is required");
      return;
    }

    if (formData.role === "STUDENT_REP" && !formData.teamCode) {
      setError("Team code is required");
      return;
    }

    if (
      formData.role === "STUDENT_REP" &&
      !/^TEAM-\d{2}$/.test(formData.teamCode)
    ) {
      setError("Team code must follow format TEAM-XX (e.g., TEAM-01, TEAM-15)");
      return;
    }

    setLoading(true);

    try {
      const response = await completeProfile(formData);

      const updatedUser = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        pictureUrl: response.user.pictureUrl || null,
        role: response.user.role,
        isProfileComplete: response.user.isProfileComplete,
        studentId: response.user.studentId || null,
        teamCode: response.user.teamCode || null,
        department: response.user.department || null,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("token", response.token);
      updateUser(updatedUser);

      await new Promise((resolve) => setTimeout(resolve, 300));

      if (updatedUser.role === "STUDENT_REP") {
        navigate("/student/dashboard", { replace: true });
      } else if (updatedUser.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (updatedUser.role === "FACULTY_ADVISER") {
        navigate("/pending-approval", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data || err.message || "Failed to complete profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-uppercase team code as user types
    if (name === "teamCode") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const requiresApproval = formData.role === "FACULTY_ADVISER";

  const rolePreview =
    formData.role === "STUDENT_REP"
      ? {
          icon: "🎓",
          title: "As a Student Representative",
          features: [
            "Book consultations with your thesis adviser",
            "Track your thesis progress and milestones",
            "View your group's consultation history",
            "Receive notifications for upcoming meetings",
          ],
        }
      : {
          icon: "👨‍🏫",
          title: "As a Faculty Adviser",
          features: [
            "Set your consultation availability schedule",
            "Review and approve consultation requests",
            "Track student progress across groups",
            "Record notes and feedback after sessions",
          ],
        };

  return (
    <div className="complete-profile-wrapper">
      <div className="profile-visual-panel">
        <div className="visual-content">
          <div className="brand-header">
            <img src={ThesisHubLogo} alt="Logo" className="brand-logo" />
            <h1 className="brand-title">
              Thesis Consultation
              <br />
              Booking
            </h1>
            <p className="brand-subtitle">
              IT Department - Consultation System
            </p>
          </div>

          <div className="progress-steps">
            <div className="progress-step completed">
              <div className="step-icon">✓</div>
              <div className="step-label">Sign In</div>
            </div>
            <div className="progress-connector completed"></div>
            <div className="progress-step active">
              <div className="step-icon">2</div>
              <div className="step-label">Complete Profile</div>
            </div>
            <div className="progress-connector"></div>
            <div className="progress-step">
              <div className="step-icon">3</div>
              <div className="step-label">Dashboard</div>
            </div>
          </div>

          <div className="motivation-box">
            <h3>Almost There!</h3>
            <p>
              Just one more step to access your personalized consultation
              dashboard and start collaborating with your thesis adviser.
            </p>
          </div>

          <div className="role-preview-box">
            <div className="role-preview-icon">{rolePreview.icon}</div>
            <h4>{rolePreview.title}</h4>
            <ul className="role-features">
              {rolePreview.features.map((f, i) => (
                <li key={i}>
                  <span className="check-icon">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="profile-form-panel">
        <div className="form-content tinted-card">
          <div className="form-header">
            <h2 className="form-title">Complete Your Profile</h2>
            <p className="form-subtitle">
              Welcome, <strong>{user?.name}</strong>! Tell us more about
              yourself.
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
              <>
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

                <FormInput
                  label="Team Code"
                  type="text"
                  name="teamCode"
                  value={formData.teamCode}
                  onChange={handleChange}
                  placeholder="TEAM-01"
                  disabled={loading}
                  hint="Enter your thesis group/team code (e.g., TEAM-01, TEAM-15)"
                  required
                />
              </>
            )}

            {formData.role === "FACULTY_ADVISER" && (
              <FormInput
                label="Department"
                type="text"
                name="department"
                value="IT Department"
                onChange={() => {}}
                placeholder="IT Department"
                disabled={true}
                hint="This system is exclusively for the IT Department"
                required
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

          <div className="form-footer">
            <p>
              🔒 Your information will be securely stored and used only for
              system access management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompleteProfilePage;
