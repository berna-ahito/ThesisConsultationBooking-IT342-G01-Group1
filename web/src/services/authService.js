import api from './api';

// Google OAuth Login
export const loginWithGoogle = async (credential) => {
    const response = await api.post('/auth/google', { credential });
    return response.data;
};

// Traditional Email/Password Login
export const loginWithEmail = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

// Registration
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

// Complete Profile (after Google OAuth)
export const completeProfile = async (profileData) => {
    console.log('🚀 [authService] completeProfile called with:', profileData);
    console.log('🔑 [authService] Token from localStorage:', localStorage.getItem('token'));

    try {
        const response = await api.post('/auth/complete-profile', profileData);
        console.log('✅ [authService] Complete profile success:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ [authService] Complete profile error:', error);
        console.error('❌ [authService] Error response:', error.response?.data);
        console.error('❌ [authService] Error status:', error.response?.status);
        throw error;
    }
};

// Update existing profile (editable profile page)
export const updateProfile = async (profileData) => {
    const response = await api.post('/auth/update-profile', profileData);
    return response.data;
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Get token
export const getToken = () => {
    return localStorage.getItem('token');
};