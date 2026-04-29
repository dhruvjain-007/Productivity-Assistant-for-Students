import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const taskService = {
  getTasks: (filters) =>
    api.get('/tasks', { params: filters }).then((res) => res.data.tasks),
  getTask: (taskId) => api.get(`/tasks/${taskId}`).then((res) => res.data.task),
  createTask: (data) => api.post('/tasks', data).then((res) => res.data.task),
  updateTask: (taskId, data) =>
    api.put(`/tasks/${taskId}`, data).then((res) => res.data.task),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`).then((res) => res.data),
  generatePlan: (date) =>
    api.post('/tasks/generate-plan', { date }).then((res) => res.data),
  getRecommendation: (context) =>
    api.get('/tasks/recommendation', { params: context }).then((res) => res.data),
};

export const noteService = {
  getNotes: (filters) =>
    api.get('/notes', { params: filters }).then((res) => res.data.notes),
  getNote: (noteId) => api.get(`/notes/${noteId}`).then((res) => res.data.note),
  createNote: (data) => api.post('/notes', data).then((res) => res.data.note),
  updateNote: (noteId, data) =>
    api.put(`/notes/${noteId}`, data).then((res) => res.data.note),
  deleteNote: (noteId) =>
    api.delete(`/notes/${noteId}`).then((res) => res.data),
  summarizeNote: (noteId, detailLevel) =>
    api
      .post(`/notes/${noteId}/summarize`, { detailLevel })
      .then((res) => res.data.summary),
  toggleFavorite: (noteId) =>
    api.put(`/notes/${noteId}/favorite`).then((res) => res.data.note),
};

export const focusService = {
  startSession: (data) =>
    api.post('/focus-sessions', data).then((res) => res.data.session),
  endSession: (sessionId, data) =>
    api.put(`/focus-sessions/${sessionId}/end`, data).then((res) => res.data.session),
  getSessions: (filters) =>
    api.get('/focus-sessions', { params: filters }).then((res) => res.data.sessions),
  getAnalytics: (days) =>
    api.get('/focus-sessions/analytics/summary', { params: { days } }).then((res) => res.data),
};

export const analyticsService = {
  getDashboard: () =>
    api.get('/analytics/dashboard').then((res) => res.data.dashboard),
  getReport: (days) =>
    api.get('/analytics/report', { params: { days } }).then((res) => res.data.report),
  getInsights: (days) =>
    api.get('/analytics/insights', { params: { days } }).then((res) => res.data.insights),
};

export default api;
