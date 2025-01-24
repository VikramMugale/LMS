import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Remove axios-cache-adapter and implement simple caching if needed
const cache = new Map();

api.interceptors.response.use(
  response => {
    // Simple cache implementation
    const url = response.config.url;
    cache.set(url, {
      data: response.data,
      timestamp: Date.now()
    });
    return response;
  },
  error => Promise.reject(error)
);

// Add a request interceptor
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

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Add retry logic
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.config && !error.config.__isRetryRequest) {
      error.config.__isRetryRequest = true;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Courses
  getCourses: () => api.get('/courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  getUserCourses: () => api.get('/user/courses'),
  enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),

  // Auth
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  logout: () => api.post('/auth/logout'),

  // User
  getUserProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.put('/user/password', data),
};

export default api;
