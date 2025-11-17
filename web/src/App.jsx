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
import StudentShell from "./components/layout/StudentShell";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import Consultations from "./pages/student/Consultations";
import Schedule from "./pages/student/Schedule";
import Documents from "./pages/student/Documents";
import Messages from "./pages/student/Messages";
import Settings from "./pages/student/Settings";
import Profile from "./pages/student/Profile";
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
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["STUDENT_REP"]}>
                  <StudentShell />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="consultations" element={<Consultations />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="documents" element={<Documents />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Route>
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
