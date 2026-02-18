/**
 * API Client
 * Axios instance con interceptors para JWT y error handling
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Log para debugging (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:');
  console.log('  - Base URL:', API_BASE_URL);
  console.log('  - Env var:', import.meta.env.VITE_API_URL);
}


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundo timeout
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', config.method.toUpperCase(), config.baseURL + config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config?.url,
      });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};


export const petsAPI = {
  listPublic: (page = 1, limit = 12, search = '') =>
    api.get('/pets', { params: { page, limit, search } }),
  getById: (id) => api.get(`/pets/${id}`),
  getMyPets: () => api.get('/pets/my/list'),
  create: (formData) => api.post('/pets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/pets/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/pets/${id}`),
  toggle: (id) => api.patch(`/pets/${id}/toggle`),
};


export const likesAPI = {
  like: (petId) => api.post('/likes', { petId }),
  unlike: (petId) => api.delete(`/likes/${petId}`),
  getMyLikes: () => api.get('/likes/my-likes'),
};

export default api;

