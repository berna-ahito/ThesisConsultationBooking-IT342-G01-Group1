import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyConsultations,
  cancelConsultation,
} from "../../services/consultationService";
import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import ConsultationCard from "../../components/consultations/ConsultationCard";
import Loader from "../../components/common/Loader";
import { BooksMultiIcon } from "../../components/common/icons/HeaderIcons";
import "./ConsultationHistoryPage.css";
import ConfirmModal from "../../components/common/ConfirmModal";

const ConsultationHistoryPage = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeFilter, setActiveFilter] = useState("ACTIVE");
  const [cancellingId, setCancellingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [consultationToCancel, setConsultationToCancel] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await getMyConsultations();
      console.log("📦 RAW API Response:", data);

      // Handle both paginated response and direct array
      const consultationsList = Array.isArray(data) ? data : data.content || [];
      console.log("📋 Total consultations:", consultationsList.length);

      // Check rejected consultations specifically
      consultationsList.forEach((c, i) => {
        if (c.status === "REJECTED") {
          console.log(`🔴 Rejected #${i}:`, {
            id: c.id,
            topic: c.topic,
            rejectionReason: c.rejectionReason,
            hasRejectionReason: !!c.rejectionReason,
          });
        }
      });

      setConsultations(consultationsList);
    } catch (err) {
      setError("Failed to load consultation history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isOldConsultation = useCallback((consultation) => {
    const consultDate = new Date(consultation.scheduledDate);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const isOld = consultDate < threeDaysAgo;
    const isInactive = ["REJECTED", "CANCELLED", "COMPLETED"].includes(
      consultation.status
    );

    return isOld && isInactive;
  }, []);
  const filterConsultations = useCallback(() => {
    if (activeFilter === "ACTIVE") {
      // Active = only PENDING and APPROVED
      setFilteredConsultations(
        consultations.filter((c) => ["PENDING", "APPROVED"].includes(c.status))
      );
    } else if (activeFilter === "HISTORY") {
      // History = old inactive consultations
      setFilteredConsultations(
        consultations.filter((c) => isOldConsultation(c))
      );
    } else if (activeFilter === "ALL") {
      setFilteredConsultations(consultations);
    } else {
      setFilteredConsultations(
        consultations.filter((c) => c.status === activeFilter)
      );
    }
    setPage(1);
  }, [consultations, activeFilter, isOldConsultation]);

  useEffect(() => {
    filterConsultations();
  }, [filterConsultations]);

  const handleCancel = (consultationId) => {
    setConsultationToCancel(consultationId);
    setShowConfirmModal(true);
  };

  const confirmCancel = async () => {
    try {
      setCancellingId(consultationToCancel);
      setError("");
      await cancelConsultation(consultationToCancel);
      setSuccess("Consultation cancelled successfully");
      setTimeout(() => setSuccess(""), 3000);
      fetchConsultations();
      setShowConfirmModal(false);
      setConsultationToCancel(null);
    } catch (err) {
      setError(err.response?.data || "Failed to cancel consultation");
    } finally {
      setCancellingId(null);
    }
  };

  const filters = [
    {
      label: "Active",
      value: "ACTIVE",
      count: consultations.filter((c) =>
        ["PENDING", "APPROVED"].includes(c.status)
      ).length,
    },
    {
      label: "All",
      value: "ALL",
      count: consultations.length,
    },
    {
      label: "History",
      value: "HISTORY",
      count: consultations.filter((c) => isOldConsultation(c)).length,
    },
  ];

  if (loading) {
    return (
      <DashboardLayout role="STUDENT_REP">
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="STUDENT_REP">
      <div className="history-page">
        <DashboardHeader
          title="My Consultation History"
          subtitle="View and manage your consultation requests"
          icon={<BooksMultiIcon />}
        />

        <div className="history-container">
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

          {/* Filters */}
          <div className="filters-section">
            {filters.map((filter) => (
              <button
                key={filter.value}
                className={`filter-btn ${
                  activeFilter === filter.value ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
                <span className="filter-count">{filter.count}</span>
              </button>
            ))}
          </div>

          {/* Consultations List */}
          {filteredConsultations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <h3>No Consultations Found</h3>
              <p>
                {activeFilter === "ALL"
                  ? "You haven't booked any consultations yet."
                  : `No ${activeFilter.toLowerCase()} consultations.`}
              </p>
              <Button onClick={() => navigate("/student/book")}>
                Book Consultation
              </Button>
            </div>
          ) : (
            <>
              <div className="consultations-list">
                {filteredConsultations
                  .slice((page - 1) * perPage, page * perPage)
                  .map((consultation) => (
                    <ConsultationCard
                      key={consultation.id}
                      consultation={consultation}
                      showActions={true}
                      onCancel={handleCancel}
                      processing={cancellingId === consultation.id}
                    />
                  ))}
              </div>
              {Math.ceil(filteredConsultations.length / perPage) > 1 && (
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    ← Previous
                  </button>
                  <span className="pagination-info">
                    Page {page} of{" "}
                    {Math.ceil(filteredConsultations.length / perPage)}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setPage(
                        Math.min(
                          Math.ceil(filteredConsultations.length / perPage),
                          page + 1
                        )
                      )
                    }
                    disabled={
                      page === Math.ceil(filteredConsultations.length / perPage)
                    }
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setConsultationToCancel(null);
        }}
        onConfirm={confirmCancel}
        title="Cancel Consultation"
        message="Are you sure you want to cancel this consultation request? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="Keep Request"
        loading={cancellingId === consultationToCancel}
      />
    </DashboardLayout>
  );
};

export default ConsultationHistoryPage;
