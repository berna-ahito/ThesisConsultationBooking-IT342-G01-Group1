import api from './api';

// Get student's consultations
export const getMyConsultations = async () => {
    try {
        const response = await api.get("/consultations/my-consultations");
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch my consultations:", error);
        throw error;
    }
};

// Get upcoming consultations
export const getUpcomingConsultations = async () => {
    const response = await api.get('/consultations/upcoming');
    return response.data;
};

// Get past consultations
export const getPastConsultations = async () => {
    const response = await api.get('/consultations/past');
    return response.data;
};

// Get available adviser schedules
export const getAvailableSchedules = async () => {
    const response = await api.get('/schedules/available');
    return response.data;
};

// Book consultation
export const bookConsultation = async (bookingData) => {
    const response = await api.post('/consultations/book', bookingData);
    return response.data;
};

// Cancel consultation
export const cancelConsultation = async (consultationId) => {
    try {
        const response = await api.delete(`/consultations/${consultationId}`);
        return response.data;
    } catch (error) {
        const message = error.response?.data || "Failed to cancel consultation";
        throw new Error(message);
    }
};

// Get consultation details
export const getConsultationDetails = async (consultationId) => {
    const response = await api.get(`/consultations/${consultationId}`);
    return response.data;
};

// Faculty: Get pending consultations
export const getPendingConsultations = async () => {
    try {
        const response = await api.get("/consultations/pending");
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch pending consultations:", error);
        throw error;
    }
};

// Faculty: Approve consultation
export const approveConsultation = async (consultationId) => {
    try {
        const response = await api.post(`/consultations/${consultationId}/approve`);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to approve consultation:", error);
        throw error;
    }
};

// Faculty: Reject consultation
export const rejectConsultation = async (consultationId, rejectionReason) => {
    try {
        const response = await api.post(`/consultations/${consultationId}/reject`, {
            rejectionReason,
        });
        return response.data;
    } catch (error) {
        console.error("❌ Failed to reject consultation:", error);
        throw error;
    }
};

// Faculty: Add notes to consultation
export const addConsultationNotes = async (consultationId, notes) => {
    try {
        const response = await api.post(`/consultations/${consultationId}/notes`, {
            notes,
        });
        return response.data;
    } catch (error) {
        console.error("❌ Failed to add notes:", error);
        throw error;
    }
};

export const getAdviserConsultations = async () => {
    const response = await api.get("/consultations/adviser/consultations");
    return response.data;
};


