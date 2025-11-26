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
import ConfirmModal from "../../components/common/ConfirmModal";
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
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleApproveClick = (userId, userName) => {
    setSelectedUser({ id: userId, name: userName });
    setConfirmAction("approve");
    setShowConfirmModal(true);
  };

  const handleRejectClick = (userId, userName) => {
    setSelectedUser({ id: userId, name: userName });
    setConfirmAction("reject");
    setShowConfirmModal(true);
  };

  const confirmApprove = async () => {
    try {
      setProcessingId(selectedUser.id);
      setError("");
      await approveUser(selectedUser.id);
      setSuccess(`${selectedUser.name} has been approved successfully!`);
      setTimeout(() => setSuccess(""), 3000);
      setShowConfirmModal(false);
      fetchPendingUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to approve user");
    } finally {
      setProcessingId(null);
    }
  };

  const confirmReject = async () => {
    try {
      setProcessingId(selectedUser.id);
      setError("");
      await rejectUser(selectedUser.id);
      setSuccess(`${selectedUser.name}'s account has been rejected`);
      setTimeout(() => setSuccess(""), 3000);
      setShowConfirmModal(false);
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
            <>
              <div className="pending-users-grid">
                {pendingUsers
                  .slice((page - 1) * perPage, page * perPage)
                  .map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      showActions={true}
                      onApprove={handleApproveClick}
                      onReject={handleRejectClick}
                      processing={processingId === user.id}
                    />
                  ))}
              </div>
              {Math.ceil(pendingUsers.length / perPage) > 1 && (
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setPage(Math.max(1, page - 1))
                    }
                    disabled={page === 1}
                  >
                    ← Previous
                  </button>
                  <span className="pagination-info">
                    Page {page} of {Math.ceil(pendingUsers.length / perPage)}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setPage(
                        Math.min(
                          Math.ceil(pendingUsers.length / perPage),
                          page + 1
                        )
                      )
                    }
                    disabled={
                      page === Math.ceil(pendingUsers.length / perPage)
                    }
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={
            confirmAction === "approve" ? confirmApprove : confirmReject
          }
          title={
            confirmAction === "approve"
              ? "Approve Faculty Adviser"
              : "Reject Faculty Account"
          }
          message={
            confirmAction === "approve"
              ? `Approve ${selectedUser?.name} as Faculty Adviser?`
              : `Reject ${selectedUser?.name}? This will permanently delete their account.`
          }
          confirmText={confirmAction === "approve" ? "Approve" : "Reject"}
          cancelText="Cancel"
          loading={processingId === selectedUser?.id}
          confirmVariant={confirmAction === "approve" ? "primary" : "danger"}
        />
        />
      </div>
    </DashboardLayout>
  );
};

export default FacultyApprovalsPage;
