// src/api/fra.js
import { apiClient } from './client.js';

export const getCrops       = () => apiClient.get('/crops/prices/current').then((r) => r.data);
export const lookupFarmer   = (params) => apiClient.get('/farmers/lookup', { params }).then((r) => r.data);
export const recordDelivery = (payload, deviceId) =>
  apiClient.post('/entitlements/deliveries', payload, { headers: { 'X-Device-Id': deviceId } }).then((r) => r.data);
export const getDepotReport = () => apiClient.get('/depots/me/report').then((r) => r.data);
export const registerFarmer = (payload) => apiClient.post('/farmers/assisted', payload).then((r) => r.data);