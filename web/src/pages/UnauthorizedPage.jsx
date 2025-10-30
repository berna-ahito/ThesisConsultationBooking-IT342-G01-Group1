import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 style={{ color: "#dc2626" }}>⛔ Access Denied</h1>
        <p>You don&apos;t have permission to access this page.</p>

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            style={{ marginRight: "10px" }}
          >
            Go Back
          </button>
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
