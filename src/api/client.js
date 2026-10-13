// src/api/client.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

export const tokens = {
  access: null,
  refresh: null,
  type: null,
  onAuthLost: () => {},
  onRotate: () => {},
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (tokens.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

let refreshInFlight = null;

const refreshPath = () =>
  tokens.type === 'farmer'
    ? '/auth/farmer/refresh'
    : '/auth/refresh';

const refreshSession = async () => {
  if (!tokens.refresh) {
    throw new Error('No refresh token is available.');
  }

  const response = await axios.post(
    `${BASE_URL}${refreshPath()}`,
    { refreshToken: tokens.refresh },
    { headers: { 'Content-Type': 'application/json' } },
  );

  tokens.access = response.data.accessToken;
  tokens.refresh = response.data.refreshToken;
  tokens.onRotate();

  return tokens.access;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = request?.url?.includes('/auth/refresh')
      || request?.url?.includes('/auth/farmer/refresh');

    if (!isUnauthorized || !request || request._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      refreshInFlight ??= refreshSession().finally(() => {
        refreshInFlight = null;
      });

      const nextAccessToken = await refreshInFlight;
      request.headers.Authorization = `Bearer ${nextAccessToken}`;

      return apiClient(request);
    } catch (refreshError) {
      Object.assign(tokens, {
        access: null,
        refresh: null,
        type: null,
      });
      tokens.onAuthLost();

      return Promise.reject(refreshError);
    }
  },
);