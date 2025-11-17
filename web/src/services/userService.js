import api from "./api";

export const getProfile = async () => {
    try {
        const response = await api.get("/users/profile");
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch profile:", error);
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await api.put("/users/profile", profileData);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to update profile:", error);
        throw error;
    }
};