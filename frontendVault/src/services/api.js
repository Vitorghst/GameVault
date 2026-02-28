import axios from 'axios';

// 👇 URL dinâmica: local em desenvolvimento, Render em produção
const baseURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api'
  : 'https://SEU_BACKEND_NO_RENDER.onrender.com/api'; // Depois de fazer o deploy, troque aqui!

const api = axios.create({
  baseURL,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Interceptor para tratar erros
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

export default api;