import axios from 'axios';

export const tokens = {
  access: null,
  refresh: null,
  type: 'farmer',        // which refresh/logout endpoint family to use
  onAuthLost: () => {},  // AuthContext registers clear()
  onRotate: () => {},    // AuthContext persists the rotated pair
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',  // relative → Vite proxy → :8080, no CORS
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (tokens.access) config.headers.Authorization = `Bearer ${tokens.access}`;
  return config;
});

let refreshing = null;

async function doRefresh() {
  // Bare axios on purpose: the refresh call must NOT re-enter this interceptor.
  const { data } = await axios.post(
    `${apiClient.defaults.baseURL}/${tokens.type === 'farmer' ? 'auth/farmer/refresh' : 'auth/refresh'}`,
    { refreshToken: tokens.refresh },
    { headers: { 'Content-Type': 'application/json' } },
  );
  tokens.access = data.accessToken;
  tokens.refresh = data.refreshToken;   // backend rotates; replaying the old one revokes the family
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