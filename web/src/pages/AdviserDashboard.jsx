import { useAuth } from "../context/AuthContext";

const AdviserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container" style={{ paddingTop: "40px" }}>
      <div className="card">
        <h1>Faculty Adviser Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>

        <button
          onClick={logout}
          className="btn btn-danger"
          style={{ marginTop: "20px" }}
        >
          Logout
        </button>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <p>
          Manage schedules, approve requests, view consultations - coming soon!
        </p>
      </div>
    </div>
  );
};

export default AdviserDashboard;
