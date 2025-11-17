import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUpcomingConsultations } from "../../services/consultationService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardHeader from "../../components/layout/DashboardHeader";
import StatsGrid from "../../components/common/StatsGrid";
import UpcomingConsultations from "../../components/consultations/UpcomingConsultations";
import QuickActions from "../../components/common/QuickActions";
import Loader from "../../components/common/Loader";
import "../../styles/dashboard-common.css";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUpcomingConsultations();

      const formatted = data.map((consultation) => ({
        id: consultation.id,
        day: new Date(consultation.scheduledDate).getDate().toString(),
        month: new Date(consultation.scheduledDate).toLocaleString("en", {
          month: "short",
        }),
        title: consultation.topic || "Thesis Consultation",
        adviser: consultation.adviserName || "Adviser",
        time: `${consultation.startTime} - ${consultation.endTime}`,
        status: consultation.status.toLowerCase(),
      }));

      setConsultations(formatted);
    } catch (error) {
      console.error("Failed to fetch consultations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const stats = [
    {
      label: "Student ID",
      value: user?.studentId || "N/A",
      primary: true,
    },
    {
      label: "Team Code",
      value: user?.teamCode || "N/A",
      description: "Your thesis group",
    },
    {
      label: "Upcoming",
      value: consultations.filter((c) => c.status === "approved").length,
      description: "Consultations scheduled",
    },
    {
      label: "Completed",
      value: 0,
      description: "Sessions this semester",
    },
  ];

  const quickActions = [
    {
      label: "Schedule Consultation",
      onClick: () => navigate("/student/book"),
    },
    {
      label: "View My Consultations",
      onClick: () => navigate("/student/consultations"),
    },
    {
      label: "Update Profile",
      onClick: () => navigate("/student/profile"),
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
      <DashboardHeader
        title={`Welcome back, ${user?.name?.split(" ")[0]}!`}
        subtitle="Here's your thesis consultation overview"
      />

      <main className="dashboard-main">
        <StatsGrid stats={stats} />

        <div className="dashboard-section-layout">
          <div className="dashboard-main-content">
            <UpcomingConsultations
              consultations={consultations}
              onBookNew={() => navigate("/student/book")}
              onViewAll={() => navigate("/student/consultations")}
            />
          </div>

          <div className="dashboard-sidebar">
            <QuickActions actions={quickActions} />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default StudentDashboard;
