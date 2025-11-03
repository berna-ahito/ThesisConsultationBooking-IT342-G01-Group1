import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, user } = useAuth();

  console.log("🔐 [ProtectedRoute] Checking access...");
  console.log("🔐 [ProtectedRoute] isAuthenticated:", isAuthenticated);
  console.log("🔐 [ProtectedRoute] role:", role);
  console.log("🔐 [ProtectedRoute] user:", user);

  // ✅ FALLBACK: Check localStorage if context hasn't updated yet
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let userRole = role;
  let authenticated = isAuthenticated;

  // If context doesn't have user but localStorage does, use localStorage
  if (!authenticated && token && storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      userRole = parsedUser.role;
      authenticated = true;
      console.log("🔐 [ProtectedRoute] Using localStorage fallback");
      console.log("🔐 [ProtectedRoute] Fallback role:", userRole);
    } catch (e) {
      console.error("🔐 [ProtectedRoute] Error parsing stored user:", e);
    }
  }

  // Not logged in - redirect to login
  if (!authenticated) {
    console.log("❌ [ProtectedRoute] Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role - redirect to unauthorized page
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log("❌ [ProtectedRoute] Wrong role, redirecting to unauthorized");
    console.log(
      "❌ [ProtectedRoute] Required:",
      allowedRoles,
      "Got:",
      userRole
    );
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ [ProtectedRoute] Access granted!");
  // All good - render the protected content
  return children;
};

export default ProtectedRoute;
