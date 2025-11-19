import api from './api';

export const getAvailableSchedules = async () => {
    const response = await api.get('/schedules/available');
    return response.data;
};

export const getMySchedules = async () => {
    const response = await api.get('/schedules/my-schedules');
    return response.data;
};

export const createSchedule = async (scheduleData) => {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
};

export const deleteSchedule = async (scheduleId) => {
    const response = await api.delete(`/schedules/${scheduleId}`);
    return response.data;
};