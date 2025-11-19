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
