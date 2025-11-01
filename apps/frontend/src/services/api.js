import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Experiments API
export const experimentsAPI = {
  getAll: (params) => api.get('/experiments', { params }),
  getById: (id) => api.get(`/experiments/${id}`),
  create: (data) => api.post('/experiments', data),
  update: (id, data) => api.put(`/experiments/${id}`, data),
  updateStatus: (id, status) => api.put(`/experiments/${id}/status`, { status }),
  delete: (id) => api.delete(`/experiments/${id}`),
};

// Variants API
export const variantsAPI = {
  getByExperiment: (experimentId) => api.get(`/variants/experiment/${experimentId}`),
  getById: (id) => api.get(`/variants/${id}`),
  create: (data) => api.post('/variants', data),
  update: (id, data) => api.put(`/variants/${id}`, data),
  updateAllocation: (id, allocation) => api.put(`/variants/${id}/allocation`, { allocation }),
  delete: (id) => api.delete(`/variants/${id}`),
};

// Events API
export const eventsAPI = {
  logExposure: (data) => api.post('/events/exposure', data),
  trackConversion: (data) => api.post('/events/conversion', data),
  getByExperiment: (experimentId, params) => api.get(`/events/experiment/${experimentId}`, { params }),
};

// Analytics API
export const analyticsAPI = {
  getConversionRate: (experimentId) => api.get(`/analytics/${experimentId}/conversion-rate`),
  getSummary: (experimentId) => api.get(`/analytics/${experimentId}/summary`),
  getDetailed: (experimentId) => api.get(`/analytics/${experimentId}`),
};

// Assignment API
export const assignmentAPI = {
  getAssignment: (data) => api.post('/assignment', data),
};

export default api;
