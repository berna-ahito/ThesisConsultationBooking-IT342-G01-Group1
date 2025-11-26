import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import AdviserDashboard from "./pages/dashboards/AdviserDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import BookConsultationPage from "./pages/student/BookConsultationPage";
import StudentProfilePage from "./pages/profiles/StudentProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import PendingConsultationsPage from "./pages/adviser/PendingConsultationsPage";
import ConsultationHistoryPage from "./pages/student/ConsultationHistoryPage";
import ConsultationsPage from "./pages/adviser/ConsultationsPage";
import FacultyProfilePage from "./pages/profiles/FacultyProfilePage";
import FacultyApprovalsPage from "./pages/admin/FacultyApprovalsPage";
import AdminProfilePage from "./pages/profiles/AdminProfilePage";
import AllUsersPage from "./pages/admin/AllUsersPage";
import "./App.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  if (!GOOGLE_CLIENT_ID) {
    console.error(
      "❌ VITE_GOOGLE_CLIENT_ID is not configured. Please check your .env file."
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || "dummy-id"}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/complete-profile" element={<CompleteProfilePage />} />
            <Route path="/pending-approval" element={<PendingApprovalPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={["STUDENT_REP"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/book"
              element={
                <ProtectedRoute allowedRoles={["STUDENT_REP"]}>
                  <BookConsultationPage />
                </ProtectedRoute>
              }
            />

            {/* Student Profile Route */}
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={["STUDENT_REP"]}>
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Consultation History */}
            <Route
              path="/student/consultations"
              element={
                <ProtectedRoute allowedRoles={["STUDENT_REP"]}>
                  <ConsultationHistoryPage />
                </ProtectedRoute>
              }
            />

            {/* Adviser Routes */}
            <Route
              path="/adviser/dashboard"
              element={
                <ProtectedRoute allowedRoles={["FACULTY_ADVISER"]}>
                  <AdviserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adviser/pending"
              element={
                <ProtectedRoute allowedRoles={["FACULTY_ADVISER"]}>
                  <PendingConsultationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adviser/consultations"
              element={
                <ProtectedRoute allowedRoles={["FACULTY_ADVISER"]}>
                  <ConsultationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adviser/profile"
              element={
                <ProtectedRoute allowedRoles={["FACULTY_ADVISER"]}>
                  <FacultyProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <FacultyApprovalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AllUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
