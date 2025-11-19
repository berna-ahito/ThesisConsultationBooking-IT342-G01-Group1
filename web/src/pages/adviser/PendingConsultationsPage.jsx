import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPendingConsultations,
  approveConsultation,
  rejectConsultation,
} from "../../services/consultationService";
import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import ConsultationCard from "../../components/consultations/ConsultationCard";
import "./PendingConsultationsPage.css";

const PendingConsultationsPage = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  const totalPages = Math.ceil(consultations.length / perPage);
  const paginatedConsultations = consultations.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    fetchPendingConsultations();
  }, []);

  const fetchPendingConsultations = async () => {
    try {
      setLoading(true);
      const data = await getPendingConsultations();
      setConsultations(data);
      setPage(1);
    } catch (err) {
      setError("Failed to load pending consultations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (consultationId) => {
    try {
      setProcessingId(consultationId);
      setError("");
      await approveConsultation(consultationId);
      setSuccess("Consultation approved successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchPendingConsultations();
    } catch (err) {
      setError(err.response?.data || "Failed to approve consultation");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (consultation) => {
    setSelectedConsultation(consultation);
    setShowRejectModal(true);
    setRejectionReason("");
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    try {
      setProcessingId(selectedConsultation.id);
      setError("");
      await rejectConsultation(selectedConsultation.id, rejectionReason);
      setSuccess("Consultation rejected");
      setTimeout(() => setSuccess(""), 3000);
      setShowRejectModal(false);
      setSelectedConsultation(null);
      setRejectionReason("");
      fetchPendingConsultations();
    } catch (err) {
      setError(err.response?.data || "Failed to reject consultation");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="FACULTY_ADVISER">
        <div style={{ padding: "2rem" }}>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="FACULTY_ADVISER">
      <div className="pending-page">
        <DashboardHeader
          title="Pending Consultation Requests"
          subtitle="Review and respond to student consultation requests"
          icon="📋"
        />

        <div className="pending-container">
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

          {consultations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Pending Requests</h3>
              <p>All consultation requests have been reviewed.</p>
              <Button onClick={() => navigate("/adviser/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <>
              <div className="consultations-grid">
                {paginatedConsultations.map((consultation) => (
                  <ConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                    showActions={true}
                    onApprove={handleApprove}
                    onReject={handleRejectClick}
                    processing={processingId === consultation.id}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="pagination-controls">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <span className="pagination-info">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowRejectModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Reject Consultation Request</h3>
              <p>
                Please provide a reason for rejecting{" "}
                <strong>{selectedConsultation?.studentName}'s</strong> request:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
                className="rejection-textarea"
              />
              <div className="modal-actions">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleRejectSubmit}
                  disabled={!rejectionReason.trim() || processingId !== null}
                  loading={processingId === selectedConsultation?.id}
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PendingConsultationsPage;
