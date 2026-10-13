// src/api/farmer.js
import { apiClient } from './client.js';

const unwrap = (response) => response.data;

export const getPaymentAccounts = () =>
  apiClient.get('/farmers/me/payment-accounts').then(unwrap);

export const addPaymentAccount = (payload) =>
  apiClient.post('/farmers/me/payment-accounts', payload).then(unwrap);

export const selectPreferredAccount = (accountId) =>
  apiClient
    .put(
      `/farmers/me/payment-accounts/${encodeURIComponent(accountId)}/preferred`,
    )
    .then(unwrap);

export const getDeliveryHistory = ({ page = 0, size = 20 } = {}) =>
  apiClient
    .get('/farmers/me/deliveries', {
      params: { page, size },
    })
    .then(unwrap);

export const getDeliveryReceipt = (receiptId) =>
  apiClient
    .get(`/farmers/me/receipts/${encodeURIComponent(receiptId)}`)
    .then(unwrap);

export const initiateSimulatedPayment = (entitlementId) =>
  apiClient
    .post(
      `/farmers/me/entitlements/${encodeURIComponent(entitlementId)}/simulate-payment`,
    )
    .then(unwrap);

export const getPaymentProgress = (paymentId) =>
  apiClient
    .get(`/farmers/me/payments/${encodeURIComponent(paymentId)}`)
    .then(unwrap);