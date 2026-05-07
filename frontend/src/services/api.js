import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => {
    const params = new URLSearchParams();
    params.append('username', data.email);
    params.append('password', data.password);
    return api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  getMe: () => api.get('/auth/me'),
};

export const recognitionAPI = {
  recognizeFrame: (data) => api.post('/recognize/frame', data),
  clearSentence: () => api.post('/recognize/clear-sentence'),
  recognizeLandmarks: (data) => api.post('/recognize/landmarks', data),
};

export const toolsAPI = {
  translate: (data) => api.post('/translate', data),
  tts: (data) => api.post('/tts', data),
};

export const gesturesAPI = {
  getAll: () => api.get('/gestures/'),
  create: (data) => api.post('/gestures/', data),
  capture: (data) => api.post('/gestures/capture', data),
  train: (data) => api.post('/gestures/train', data),
  modelStatus: () => api.get('/gestures/model-status'),
  delete: (id) => api.delete(`/gestures/${id}`),
};

export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
  getHistory: (roomId) => api.get(`/chat/history/${roomId}`),
};

export const translationsAPI = {
  getAll: (limit = 10) => api.get(`/translations/?limit=${limit}`),
  create: (data) => api.post('/translations/', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const historyAPI = {
  getAll: (params) => api.get('/history/', { params }),
  deleteItem: (id) => api.delete(`/history/${id}`),
  clearAll: () => api.delete('/history/clear'),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
