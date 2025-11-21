import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMySchedules,
  createSchedule,
  deleteSchedule,
} from "../../services/scheduleService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardHeader from "../../components/layout/DashboardHeader";
// import StatsGrid from "../../components/common/StatsGrid"; // optional, remove if unused
import QuickActions from "../../components/common/QuickActions";
import SchedulesTable from "../../components/schedules/SchedulesTable";
import CreateScheduleModal from "../../components/schedules/CreateScheduleModal";
import Loader from "../../components/common/Loader";
import "../../styles/dashboard-common.css";
import Alert from "../../components/common/Alert";
import { getPendingConsultations } from "../../services/consultationService";
import {
  PlusIcon,
  ListIcon,
  InboxIcon,
  UserIcon,
} from "../../components/common/icons";

const AdviserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalError, setModalError] = useState("");
  const [pendingCount, setPendingCount] = useState(0);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMySchedules();
      setSchedules(data);
    } catch (err) {
      console.error("❌ Failed to fetch schedules:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingCount = useCallback(async () => {
    try {
      const data = await getPendingConsultations();
      setPendingCount(data.length);
    } catch (err) {
      console.error("❌ Failed to fetch pending consultations:", err);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
    fetchPendingCount();
  }, [fetchSchedules, fetchPendingCount]);

  const handleCreateSchedule = () => {
    setModalError("");
    setShowModal(true);
  };

  const handleSubmitSchedule = async (formData) => {
    try {
      setSubmitting(true);
      setModalError("");
      setError("");

      await createSchedule(formData);

      setSuccess("Schedule created successfully!");
      setTimeout(() => setSuccess(""), 3000);

      await fetchSchedules();
      await fetchPendingCount();
      setShowModal(false);
    } catch (err) {
      console.error("❌ Failed to create schedule:", err);
      setModalError(
        err.response?.data || err.message || "Failed to create schedule"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) {
      return;
    }

    try {
      setError("");
      await deleteSchedule(scheduleId);

      setSuccess("Schedule deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);

      await fetchSchedules();
      await fetchPendingCount();
    } catch (err) {
      console.error("❌ Failed to delete schedule:", err);
      setError(
        err.response?.data || err.message || "Failed to delete schedule"
      );
    }
  };

  const quickActions = [
    {
      icon: <PlusIcon />,
      label: "Create Schedule",
      onClick: handleCreateSchedule,
      primary: true,
    },
    {
      icon: <ListIcon />,
      label: "View Consultations",
      onClick: () => navigate("/adviser/consultations"),
    },
    {
      icon: <InboxIcon />,
      label: "Pending Requests",
      onClick: () => navigate("/adviser/pending"),
      badge: pendingCount,
    },
    {
      icon: <UserIcon />,
      label: "My Profile",
      onClick: () => navigate("/adviser/profile"),
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
      <DashboardHeader
        title={`Good ${new Date().getHours() < 12 ? "morning" : "afternoon"}, ${
          user?.name?.split(" ")[0]
        }! 👋`}
        subtitle="Manage your thesis consultations and track student progress"
        icon="👨‍🏫"
      />

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

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <QuickActions
            actions={quickActions}
            title="Quick Actions"
            subtitle="Shortcut tools for your advising tasks"
          />

          <div className="section-card">
            <div className="section-header">
              <h3>My Availability Schedules</h3>
              <button onClick={handleCreateSchedule} className="btn-create">
                ➕ Add Schedule
              </button>
            </div>
            <SchedulesTable
              schedules={schedules}
              onDelete={handleDeleteSchedule}
              onCreate={handleCreateSchedule}
            />
          </div>
        </div>
      </main>

      {showModal && (
        <CreateScheduleModal
          onClose={() => {
            setShowModal(false);
            setModalError("");
          }}
          onSubmit={handleSubmitSchedule}
          loading={submitting}
          backendError={modalError}
        />
      )}
    </DashboardLayout>
  );
};

export default AdviserDashboard;
