import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdviserDashboard from "./pages/AdviserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";

function App() {
  const { isAuthenticated, role } = useAuth();

  // Redirect authenticated users from login page
  const getDefaultRedirect = () => {
    if (!isAuthenticated) return "/login";

    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "FACULTY_ADVISER") return "/adviser/dashboard";
    if (role === "STUDENT_REP") return "/student/dashboard";

    return "/login";
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={getDefaultRedirect()} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes - Student Representative */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["STUDENT_REP"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Faculty Adviser */}
      <Route
        path="/adviser/dashboard"
        element={
          <ProtectedRoute allowedRoles={["FACULTY_ADVISER"]}>
            <AdviserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={<Navigate to={getDefaultRedirect()} replace />}
      />

      {/* 404 - Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
