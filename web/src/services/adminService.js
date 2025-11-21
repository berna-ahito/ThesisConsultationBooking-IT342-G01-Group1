import api from "./api";

// Get all users
export const getAllUsers = async (page = 0, size = 20) => {
    try {
        const response = await api.get("/admin/users", {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch users:", error);
        throw error;
    }
};

// Get pending users
export const getPendingUsers = async () => {
    try {
        const response = await api.get("/admin/users/pending");
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch pending users:", error);
        throw error;
    }
};

// Approve user
export const approveUser = async (userId) => {
    try {
        const response = await api.post(`/admin/users/${userId}/approve`);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to approve user:", error);
        throw error;
    }
};

// Reject user
export const rejectUser = async (userId) => {
    try {
        const response = await api.post(`/admin/users/${userId}/reject`);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to reject user:", error);
        throw error;
    }
};

// Get user stats
export const getUserStats = async () => {
    try {
        const response = await api.get("/admin/users/stats");
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch user stats:", error);
        throw error;
    }
};