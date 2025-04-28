import axios from 'axios';

const api = axios.create({
    baseURL: 'https://todolist-backend-c8pj.onrender.com/api',
    withCredentials: true,
  });

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.token = user.token; // Match backend's expected header
      console.log('Adding token to request:', user.token); // Debug log
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

export default api;
