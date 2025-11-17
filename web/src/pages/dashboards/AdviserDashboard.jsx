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
import StatsGrid from "../../components/common/StatsGrid";
import QuickActions from "../../components/common/QuickActions";
import SchedulesTable from "../../components/schedules/SchedulesTable";
import CreateScheduleModal from "../../components/schedules/CreateScheduleModal";
import Loader from "../../components/common/Loader";
import "../../styles/dashboard-common.css";

const AdviserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleCreateSchedule = () => {
    setShowModal(true);
  };

  const handleSubmitSchedule = async (formData) => {
    try {
      setSubmitting(true);
      await createSchedule(formData);
      await fetchSchedules();
      setShowModal(false);
    } catch (err) {
      console.error("❌ Failed to create schedule:", err);
      alert(err.response?.data?.message || "Failed to create schedule");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) {
      return;
    }

    try {
      await deleteSchedule(scheduleId);
      await fetchSchedules();
    } catch (err) {
      console.error("❌ Failed to delete schedule:", err);
      alert(err.response?.data?.message || "Failed to delete schedule");
    }
  };

  const quickActions = [
    {
      icon: "➕",
      label: "Create Schedule",
      onClick: handleCreateSchedule,
      primary: true,
    },
    {
      icon: "📋",
      label: "View Consultations",
      onClick: () => navigate("/adviser/consultations"),
    },
    {
      icon: "📬",
      label: "Pending Requests",
      onClick: () => navigate("/adviser/pending"),
    },
    {
      icon: "👤",
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
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitSchedule}
          loading={submitting}
        />
      )}
    </DashboardLayout>
  );
};

export default AdviserDashboard;
