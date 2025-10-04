import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL ?? 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Add the token to the Authorization header if it exists
  const token = sessionStorage.getItem('wallet_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      statusCode: error?.response?.statusCode ?? 500,
      message: null,
      error: 'Error de conexión con el servidor',
      data: null,
    });
  },
);

export default api;
