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
import "./ConsultationsPage.css";

const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await getAdviserConsultations();
      setConsultations(data);
    } catch (err) {
      setError("Failed to load consultations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterConsultations = useCallback(() => {
    if (activeFilter === "ALL") {
      setFilteredConsultations(consultations);
    } else {
      setFilteredConsultations(
        consultations.filter((c) => c.status === activeFilter)
      );
    }
  }, [consultations, activeFilter]);

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
    { label: "All", value: "ALL", count: consultations.length },
    {
      label: "Approved",
      value: "APPROVED",
      count: consultations.filter((c) => c.status === "APPROVED").length,
    },
    {
      label: "Completed",
      value: "COMPLETED",
      count: consultations.filter((c) => c.status === "COMPLETED").length,
    },
    {
      label: "Rejected",
      value: "REJECTED",
      count: consultations.filter((c) => c.status === "REJECTED").length,
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
          icon="📋"
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
            <div className="consultations-list">
              {filteredConsultations.map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  showActions={true}
                  onAddNotes={handleAddNotes}
                  processing={submitting}
                />
              ))}
            </div>
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
