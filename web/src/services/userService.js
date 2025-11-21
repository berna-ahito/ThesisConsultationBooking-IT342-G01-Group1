import api from "./api";
import { supabase } from "./supabaseClient";


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
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = parsedUser?.id || "anonymous";

    const ext = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (error) {
        console.error(error);
        throw error;
    }

    const { data: publicData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

    const pictureUrl = publicData.publicUrl;

    const updatedProfile = await updateProfile({ pictureUrl });

    return updatedProfile;
};

// Deactivate own account
export const deactivateMyAccount = async () => {
    await api.put('/users/deactivate');
};

// Admin: Deactivate user
export const deactivateUser = async (userId) => {
    const response = await api.put(`/users/admin/${userId}/deactivate`);
    return response.data;
};

// Admin: Reactivate user
export const reactivateUser = async (userId) => {
    const response = await api.put(`/users/admin/${userId}/reactivate`);
    return response.data;
};

// Admin: Delete user
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