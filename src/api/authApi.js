import { apiClient } from './client.js';

export const farmerLogin  = (payload) => apiClient.post('/auth/farmer/login', payload);
export const staffLogin   = (payload) => apiClient.post('/auth/login', payload);
export const farmerLogout = () => apiClient.post('/auth/farmer/logout');
export const staffLogout  = () => apiClient.post('/auth/logout');