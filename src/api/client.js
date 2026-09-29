// src/api/client.js
import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor for Multi-Stakeholder Auth
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('agriswift_token');
    const role = localStorage.getItem('agriswift_role'); // 'farmer', 'depot_officer'
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (role) config.headers['X-User-Role'] = role;
    return config;
});