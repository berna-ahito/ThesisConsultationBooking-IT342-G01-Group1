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
import "./ConsultationHistoryPage.css";

const ConsultationHistoryPage = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await getMyConsultations();
      setConsultations(data);
    } catch (err) {
      setError("Failed to load consultation history");
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

  const handleCancel = async (consultationId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this consultation request?"
      )
    ) {
      return;
    }

    try {
      setCancellingId(consultationId);
      setError("");
      await cancelConsultation(consultationId);
      setSuccess("Consultation cancelled successfully");
      setTimeout(() => setSuccess(""), 3000);
      fetchConsultations();
    } catch (err) {
      setError(err.response?.data || "Failed to cancel consultation");
    } finally {
      setCancellingId(null);
    }
  };

  const filters = [
    { label: "All", value: "ALL", count: consultations.length },
    {
      label: "Pending",
      value: "PENDING",
      count: consultations.filter((c) => c.status === "PENDING").length,
    },
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
      <DashboardLayout role="STUDENT_REP">
        <div style={{ padding: "2rem" }}>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="STUDENT_REP">
      <div className="history-page">
        <DashboardHeader
          title="My Consultation History"
          subtitle="View and manage your consultation requests"
          icon="📚"
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
            <div className="consultations-list">
              {filteredConsultations.map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  showActions={true}
                  onCancel={handleCancel}
                  processing={cancellingId === consultation.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConsultationHistoryPage;
