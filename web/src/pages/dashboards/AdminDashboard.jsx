import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserStats, getPendingUsers } from "../../services/adminService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardHeader from "../../components/layout/DashboardHeader";
import StatsGrid from "../../components/common/StatsGrid";
import QuickActions from "../../components/common/QuickActions";
import Loader from "../../components/common/Loader";
import "../../styles/dashboard-common.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, pendingData] = await Promise.all([
        getUserStats(),
        getPendingUsers(),
      ]);
      setStats(statsData);
      setPendingCount(pendingData.length);
    } catch (err) {
      console.error("❌ Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const quickActions = [
    {
      icon: "👨‍🏫",
      label: "Pending Approvals",
      onClick: () => navigate("/admin/approvals"),
      primary: true,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      icon: "👥",
      label: "All Users",
      onClick: () => navigate("/admin/users"),
    },
    {
      icon: "👤",
      label: "My Profile",
      onClick: () => navigate("/admin/profile"),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <DashboardHeader
        title={`Welcome back, ${user?.name?.split(" ")[0]}! 👋`}
        subtitle="Monitor and manage the thesis consultation system"
        icon="⚙️"
      />

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <QuickActions actions={quickActions} />

          {/* System Statistics */}
          <div className="section-card">
            <h3 className="section-title">System Overview</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎓</div>
                <div className="stat-info">
                  <p className="stat-label">Students</p>
                  <p className="stat-value">{stats?.students || 0}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👨‍🏫</div>
                <div className="stat-info">
                  <p className="stat-label">Faculty Advisers</p>
                  <p className="stat-value">{stats?.faculty || 0}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚙️</div>
                <div className="stat-info">
                  <p className="stat-label">Admins</p>
                  <p className="stat-value">{stats?.admins || 0}</p>
                </div>
              </div>
              <div className="stat-card highlight">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <p className="stat-label">Pending Approval</p>
                  <p className="stat-value">{stats?.pendingUsers || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approvals Preview */}
          {pendingCount > 0 && (
            <div className="alert-card">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <strong>Action Required:</strong> You have {pendingCount}{" "}
                faculty account{pendingCount > 1 ? "s" : ""} pending approval.
              </div>
              <button
                onClick={() => navigate("/admin/approvals")}
                className="alert-button"
              >
                Review Now →
              </button>
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default AdminDashboard;
