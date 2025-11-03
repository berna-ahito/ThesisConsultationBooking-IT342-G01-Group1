import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompleteProfilePage from "./pages/CompleteProfilePage"; // 🎯 NEW
import PendingApprovalPage from "./pages/PendingApprovalPage"; // 🎯 NEW
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import AdviserDashboard from "./pages/dashboards/AdviserDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import "./App.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 🎯 NEW: Profile Completion Routes */}
            <Route path="/complete-profile" element={<CompleteProfilePage />} />
            <Route path="/pending-approval" element={<PendingApprovalPage />} />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={["STUDENT_REP"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adviser/dashboard"
              element={
                <ProtectedRoute allowedRoles={["FACULTY_ADVISER"]}>
                  <AdviserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
