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
export const uploadProfileImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/users/profile/upload-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Failed to upload profile image:", error);
        throw error;
    }
};

export const deactivateMyAccount = async () => {
    await api.put('/users/deactivate');
};

export const deactivateUser = async (userId) => {
    const response = await api.put(`/users/admin/${userId}/deactivate`);
    return response.data;
};

export const reactivateUser = async (userId) => {
    const response = await api.put(`/users/admin/${userId}/reactivate`);
    return response.data;
};

export const deleteUser = async (userId) => {
    await api.delete(`/admin/users/${userId}`);
};

export const getArchivedUsers = async () => {
    const response = await api.get("/admin/users/archived");
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};