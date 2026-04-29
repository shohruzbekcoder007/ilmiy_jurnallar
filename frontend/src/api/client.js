import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const client = axios.create({
  baseURL,
  withCredentials: true,
});

let accessToken = null;
let onUnauthorized = null;

export function setAccessToken(token) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}
export function setOnUnauthorized(fn) {
  onUnauthorized = fn;
}

client.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  const lang = localStorage.getItem('lang');
  if (lang) {
    config.headers = config.headers || {};
    config.headers['Accept-Language'] = lang;
  }
  return config;
});

let refreshing = null;
client.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && !original.url.includes('/auth/')) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = client.post('/auth/refresh').finally(() => {
            refreshing = null;
          });
        }
        const { data } = await refreshing;
        const newToken = data?.data?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return client(original);
        }
      } catch {
        if (onUnauthorized) onUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

export default client;
