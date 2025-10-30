import api from './api';

const authService = {
    // Login with Google OAuth
    async loginWithGoogle(credential) {
        try {
            const response = await api.post('/api/auth/google', { credential });
            const { token, user } = response.data;

            // Store token and user info
            localStorage.setItem('accessToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { token, user };
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    // Logout
    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('accessToken');
    },

    // Get user role
    getUserRole() {
        const user = this.getCurrentUser();
        return user?.role || null;
    },
};

export default authService;