import { useAuth } from "../../context/AuthContext";
import DashboardHeader from "../../components/layout/DashboardHeader";
import WelcomeCard from "../../components/common/WelcomeCard";
import QuickActions from "../../components/common/QuickActions";
import UpcomingConsultations from "../../components/consultations/UpcomingConsultations";
import RecentActivity from "../../components/common/RecentActivity";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const { user } = useAuth();
  const handleBookConsultation = () => {
    console.log("Book consultation clicked");
    // TODO: navigate('/student/book');
  };

  const handleViewSchedule = () => {
    console.log("View schedule clicked");
    // TODO: navigate('/student/schedule');
  };

  const handleViewDocuments = () => {
    console.log("View documents clicked");
    // TODO: navigate('/student/documents');
  };

  const handleViewMessages = () => {
    console.log("View messages clicked");
    // TODO: navigate('/student/messages');
  };

  const welcomeStats = [
    { label: "Student ID", value: user?.studentId || "N/A" },
    { label: "Upcoming", value: 0 },
    { label: "Completed", value: 0 },
  ];

  const quickActions = [
    {
      icon: "📅",
      label: "Book Consultation",
      onClick: handleBookConsultation,
      primary: true,
    },
    {
      icon: "📋",
      label: "View Schedule",
      onClick: handleViewSchedule,
    },
    {
      icon: "📄",
      label: "My Documents",
      onClick: handleViewDocuments,
    },
    {
      icon: "💬",
      label: "Messages",
      onClick: handleViewMessages,
    },
  ];

  const recentActivities = [
    {
      icon: "✅",
      title: "Account Created",
      description: "Welcome to the Thesis Consultation System",
      time: "Just now",
      type: "success",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-main">
        <DashboardHeader
          title="Thesis Consultation Booking"
          subtitle="Student Portal"
          icon="🎓"
        />

        <div className="dashboard-content">
          <WelcomeCard
            userName={user?.name}
            greeting="Welcome back"
            message="You're all set to manage your thesis consultations."
            stats={welcomeStats}
          />

          <QuickActions actions={quickActions} />

          <UpcomingConsultations
            consultations={[]}
            emptyMessage="No upcoming consultations"
            emptySubtext="Book your first consultation to get started!"
            onBookNow={handleBookConsultation}
            showBookButton={true}
          />

          <RecentActivity
            title="Recent Activity"
            activities={recentActivities}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
