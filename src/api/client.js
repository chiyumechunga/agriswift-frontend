// src/api/client.js
import axios from 'axios';

export const tokens = {
  access: null,
  refresh: null,
  type: 'farmer',
  onAuthLost: () => {},
  onRotate: () => {},
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (tokens.access) config.headers.Authorization = `Bearer ${tokens.access}`;
  return config;
});

let refreshing = null;

async function doRefresh() {
  const { data } = await axios.post(
    `${apiClient.defaults.baseURL}/${tokens.type === 'farmer' ? 'auth/farmer/refresh' : 'auth/refresh'}`,
    { refreshToken: tokens.refresh },
    { headers: { 'Content-Type': 'application/json' } },
  );
  tokens.access = data.accessToken;
  tokens.refresh = data.refreshToken;
  tokens.onRotate();
  return data.accessToken;
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retry && tokens.refresh) {
      original._retry = true;
      try {
        refreshing ??= doRefresh().finally(() => { refreshing = null; });
        const access = await refreshing;
        original.headers.Authorization = `Bearer ${access}`;
        return apiClient(original);
      } catch {
        tokens.onAuthLost();
        return Promise.reject(error);
      }
    }
    if (error.response?.status === 401 && !tokens.refresh) tokens.onAuthLost();
    return Promise.reject(error);
  },
);