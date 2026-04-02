import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://violet-leopard-500489.hostingersite.com/hr/public/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hr-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hr-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;