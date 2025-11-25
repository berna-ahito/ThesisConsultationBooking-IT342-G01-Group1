import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../../services/adminService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardHeader from "../../components/layout/DashboardHeader";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import UserCard from "../../components/common/UserCard";
import Loader from "../../components/common/Loader";
import { ProfessorIcon } from "../../components/common/icons/HeaderIcons";
import "./FacultyApprovalsPage.css";

const FacultyApprovalsPage = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const data = await getPendingUsers();
      setPendingUsers(data);
    } catch (err) {
      setError("Failed to load pending approvals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, userName) => {
    if (!window.confirm(`Approve ${userName} as Faculty Adviser?`)) {
      return;
    }

    try {
      setProcessingId(userId);
      setError("");
      await approveUser(userId);
      setSuccess(`${userName} has been approved successfully!`);
      setTimeout(() => setSuccess(""), 3000);
      fetchPendingUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to approve user");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId, userName) => {
    if (
      !window.confirm(
        `Reject ${userName}? This will permanently delete their account.`
      )
    ) {
      return;
    }

    try {
      setProcessingId(userId);
      setError("");
      await rejectUser(userId);
      setSuccess(`${userName}'s account has been rejected`);
      setTimeout(() => setSuccess(""), 3000);
      fetchPendingUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reject user");
    } finally {
      setProcessingId(null);
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
      <div className="faculty-approvals-page">
        <DashboardHeader
          title="Pending Faculty Approvals"
          subtitle="Review and approve faculty adviser accounts"
          icon={<ProfessorIcon />}
        />

        <div className="approvals-container">
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

          {pendingUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>No Pending Approvals</h3>
              <p>All faculty accounts have been reviewed.</p>
              <Button onClick={() => navigate("/admin/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <div className="pending-users-grid">
              {pendingUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  showActions={true}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  processing={processingId === user.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyApprovalsPage;
