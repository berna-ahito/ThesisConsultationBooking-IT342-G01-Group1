import { createContext, useContext, useEffect, useState } from "react";
import { loginWithGoogle as googleLogin } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("❌ Failed to parse saved user:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentialOrToken, userData = null) => {
    try {
      let response;

      if (userData) {
        response = { token: credentialOrToken, user: userData };
      } else {
        response = await googleLogin(credentialOrToken);
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);

      return response.user;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    console.log("🔄 Updating user in context:", updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const isAuthenticated = !!user;
  const role = user?.role || null;

  console.log("🔐 [AuthContext] Current state:", {
    isAuthenticated,
    role,
    user: user?.email,
    isProfileComplete: user?.isProfileComplete,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        loading,
        isAuthenticated,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;
