import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container" style={{ paddingTop: "40px" }}>
      <div className="card">
        <h1>Student Representative Dashboard</h1>
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
        <p>Book consultation, view schedules, check status - coming soon!</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
