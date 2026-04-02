import axios from 'axios';

const API_BASE_URL = 'https://java-recycling-marketplace-application.onrender.com/';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies for session management
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Automatic token refresh with cookies
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loops and don't redirect if just checking auth status
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/api/auth/me')) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        // Only redirect to login if we explicitly failed to refresh a protected route
        if (!originalRequest.url.includes('/api/auth/logout')) {
           window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/api/auth/signup', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me',{
    withCredentials:true
  }),
  getRewards: (userId) => api.get(`/api/auth/rewards/${userId}`),
  forgotPassword: (email) => api.post(`/api/auth/forgot-password?email=${email}`),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/api/products/all'),
  getAllWithSellers: () => api.get('/api/products/allWithSellers'),
  getById: (id) => api.get(`/api/products/${id}`),
  add: (formData) => api.post('/api/products/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Seller API
export const sellerAPI = {
  getOrders: (sellerId) => api.get(`/api/orders/seller/${sellerId}`),
};

// Orders API
export const ordersAPI = {
  buy: (orderData) => api.post('/api/orders/buy', orderData),
  getUserOrders: (userId) => api.get(`/api/orders/user/${userId}`),
  cancelOrder: (orderId) => api.delete(`/api/orders/cancel/${orderId}`),
  assignDelivery: (orderId, deliveryBoyId) => api.post(`/api/orders/${orderId}/assign?deliveryBoyId=${deliveryBoyId}`),
  completeDelivery: (orderId, token) => api.post(`/api/orders/${orderId}/complete?token=${token}`),
  getAssignedOrders: (deliveryBoyId) => api.get(`/api/orders/delivery/${deliveryBoyId}`),
  getPendingOrders: () => api.get('/api/orders/pending'),
};

// User Details API (Pickup requests)
export const userDetailsAPI = {
  add: (detailData, userId) => api.post(`/api/details/add?userId=${userId}`, detailData),
  getUserDetails: (userId) => api.get(`/api/details/user/${userId}`),
  modify: (id, detailData) => api.put(`/api/details/modify/${id}`, detailData),
  assignDelivery: (detailId, deliveryBoyId) => api.post(`/api/details/assign/${detailId}?deliveryBoyId=${deliveryBoyId}`),
  completeDelivery: (detailId, token) => api.post(`/api/details/complete/${detailId}?token=${token}`),
  getAssignedPickups: (deliveryBoyId) => api.get(`/api/details/delivery/${deliveryBoyId}`),
  getPendingPickups: () => api.get('/api/details/pending'),
};

export default api;
