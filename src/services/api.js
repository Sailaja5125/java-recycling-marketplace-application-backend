import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Add token to requests if available
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

// Handle token expiration
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
  signup: (userData) => api.post('/api/auth/signup', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
  getRewards: (userId) => api.get(`/api/auth/rewards/${userId}`),
  forgotPassword: (email) => api.post(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/api/products/all'),
  getAllWithSellers: () => api.get('/api/products/allWithSellers'),
  getById: (id) => api.get(`/api/products/${id}`),
};

// Orders API
export const ordersAPI = {
  buy: (orderData) => api.post('/api/orders/buy', orderData),
  getUserOrders: (userId) => api.get(`/api/orders/user/${userId}`),
  cancelOrder: (orderId) => api.delete(`/api/orders/cancel/${orderId}`),
};

// User Details API (Pickup requests)
export const userDetailsAPI = {
  add: (detailData, userId) => api.post(`/api/details/add?userId=${userId}`, detailData),
  getUserDetails: (userId) => api.get(`/api/details/user/${userId}`),
  modify: (id, detailData) => api.put(`/api/details/modify/${id}`, detailData),
};

export default api;
