import { useState, useEffect, useCallback } from "react";
import {
  getAdviserConsultations,
  addConsultationNotes,
} from "../../services/consultationService";
import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Alert from "../../components/common/Alert";
import AddNotesModal from "../../components/consultations/AddNotesModal";
import ConsultationCard from "../../components/consultations/ConsultationCard";
import Loader from "../../components/common/Loader";
import { ConsultationManagementIcon } from "../../components/common/icons/HeaderIcons";
import "./ConsultationsPage.css";

const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeFilter, setActiveFilter] = useState("ACTIVE");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await getAdviserConsultations();
      console.log("🔍 Full API Response:", data);
      console.log("🔍 First consultation:", data[0]);
      console.log("🔍 Adviser name in first:", data[0]?.adviserName);
      setConsultations(data);
    } catch (err) {
      setError("Failed to load consultations");
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
      setFilteredConsultations(
        consultations.filter((c) => ["PENDING", "APPROVED"].includes(c.status))
      );
    } else if (activeFilter === "HISTORY") {
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

  const handleAddNotes = (consultation) => {
    setSelectedConsultation(consultation);
    setShowNotesModal(true);
  };

  const handleSubmitNotes = async (consultationId, notes) => {
    try {
      setSubmitting(true);
      setError("");
      await addConsultationNotes(consultationId, notes);
      setSuccess("Notes added successfully! Consultation marked as completed.");
      setTimeout(() => setSuccess(""), 3000);
      setShowNotesModal(false);
      setSelectedConsultation(null);
      fetchConsultations();
    } catch (err) {
      setError(err.response?.data || "Failed to add notes");
    } finally {
      setSubmitting(false);
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
      <DashboardLayout role="FACULTY_ADVISER">
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="FACULTY_ADVISER">
      <div className="consultations-page">
        <DashboardHeader
          title="My Consultations"
          subtitle="View and manage your consultation sessions"
          icon={<ConsultationManagementIcon />}
        />

        <div className="consultations-container">
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
              <div className="empty-icon">📭</div>
              <h3>No Consultations Found</h3>
              <p>
                {activeFilter === "ALL"
                  ? "No consultations scheduled yet."
                  : `No ${activeFilter.toLowerCase()} consultations.`}
              </p>
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
                      onAddNotes={handleAddNotes}
                      processing={submitting}
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

        {/* Add Notes Modal */}
        {showNotesModal && selectedConsultation && (
          <AddNotesModal
            consultation={selectedConsultation}
            onClose={() => {
              setShowNotesModal(false);
              setSelectedConsultation(null);
            }}
            onSubmit={handleSubmitNotes}
            loading={submitting}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConsultationsPage;
