import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUpcomingConsultations,
  getMyConsultations,
} from "../../services/consultationService";
import { formatStudentId } from "../../utils/formatters";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardHeader from "../../components/layout/DashboardHeader";
import StatsGrid from "../../components/common/StatsGrid";
import UpcomingConsultations from "../../components/consultations/UpcomingConsultations";
import QuickActions from "../../components/common/QuickActions";
import Loader from "../../components/common/Loader";
import { BookIcon } from "../../components/common/icons/HeaderIcons";
import "../../styles/dashboard-common.css";
import {
  CalendarIcon,
  ListIcon,
  UserIcon,
} from "../../components/common/icons";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);

  const fetchConsultations = useCallback(async () => {
    try {
      setLoading(true);
      const upcomingData = await getUpcomingConsultations();
      const upcomingArray = Array.isArray(upcomingData)
        ? upcomingData
        : upcomingData.content || [];

      const allData = await getMyConsultations();
      const allArray = Array.isArray(allData) ? allData : allData.content || [];
      const formatted = upcomingArray.map((consultation) => ({
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

      setPendingCount(allArray.filter((c) => c.status === "PENDING").length);
      setUpcomingCount(allArray.filter((c) => c.status === "APPROVED").length);
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
      value: formatStudentId(user?.studentId) || "N/A",
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
      icon: <CalendarIcon />,
      primary: true,
    },
    {
      label: "View My Consultations",
      onClick: () => navigate("/student/consultations"),
      icon: <ListIcon />,
      badge: pendingCount + upcomingCount,
    },
    {
      label: "Update Profile",
      onClick: () => navigate("/student/profile"),
      icon: <UserIcon />,
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
        icon={<BookIcon />}
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
