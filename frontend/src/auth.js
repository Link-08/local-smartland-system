import api from './config/axios';

export const registerUser = async (userData) => {
    return await api.post('/api/auth/register', userData);
};

export const loginUser = async (credentials) => {
    return await api.post('/api/auth/login', credentials);
};