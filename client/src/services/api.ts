import axios from 'axios';
import { Product, Order, Review, User, AdminStats, Offer } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send and receive HttpOnly cookies
  timeout: 15000,
});

// Auto-attach JWT token if available as header fallback
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tpn_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Methods
export const api = {
  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    badge?: string;
    minPrice?: number;
    maxPrice?: number;
    weight?: string;
    sort?: string;
    featured?: boolean;
    bestSeller?: boolean;
    limit?: number;
  }): Promise<{ products: Product[]; count: number }> {
    const res = await apiClient.get('/products', { params });
    return res.data;
  },

  async getProductBySlug(slug: string): Promise<{ product: Product; related: Product[] }> {
    const res = await apiClient.get(`/products/${slug}`);
    return res.data;
  },

  async createProduct(productData: Partial<Product>): Promise<{ product: Product; message: string }> {
    const res = await apiClient.post('/products', productData);
    return res.data;
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<{ product: Product; message: string }> {
    const res = await apiClient.put(`/products/${id}`, productData);
    return res.data;
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },

  // Orders
  async createOrder(orderData: Partial<Order>): Promise<{ order: Order; message: string }> {
    const res = await apiClient.post('/orders', orderData);
    return res.data;
  },

  async getMyOrders(): Promise<{ orders: Order[] }> {
    const res = await apiClient.get('/orders/my-orders');
    return res.data;
  },

  async getOrderById(id: string): Promise<{ order: Order }> {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data;
  },

  async getAllOrders(status?: string): Promise<{ orders: Order[] }> {
    const res = await apiClient.get('/orders/admin/all', { params: { status } });
    return res.data;
  },

  async updateOrderStatus(id: string, status: string, note?: string): Promise<{ order: Order; message: string }> {
    const res = await apiClient.patch(`/orders/${id}/status`, { status, note });
    return res.data;
  },

  // Reviews
  async getReviews(productId: string): Promise<{ reviews: Review[] }> {
    const res = await apiClient.get(`/reviews/${productId}`);
    return res.data;
  },

  async addReview(reviewData: {
    productId: string;
    userName: string;
    userCity?: string;
    rating: number;
    comment: string;
  }): Promise<{ review: Review; message: string }> {
    const res = await apiClient.post('/reviews', reviewData);
    return res.data;
  },

  // Auth
  async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string; message: string }> {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  async register(data: { name: string; email: string; phone?: string; password: string }): Promise<{ user: User; token: string; message: string }> {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async logout(): Promise<{ message: string }> {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  async updateProfile(profileData: Partial<User>): Promise<{ user: User; message: string }> {
    const res = await apiClient.put('/auth/profile', profileData);
    return res.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const res = await apiClient.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await apiClient.post('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  },

  // Admin
  async getAdminStats(): Promise<{ stats: AdminStats }> {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  async getCustomers(): Promise<{ customers: any[] }> {
    const res = await apiClient.get('/admin/customers');
    return res.data;
  },

  async getOffers(): Promise<{ offers: Offer[] }> {
    const res = await apiClient.get('/admin/offers');
    return res.data;
  },

  // Public Offers (no auth required)
  async getPublicOffers(): Promise<{ offers: Offer[] }> {
    const res = await apiClient.get('/offers');
    return res.data;
  },

  // Admin Offer CRUD
  async createOffer(offerData: Partial<Offer>): Promise<{ offer: Offer; message: string }> {
    const res = await apiClient.post('/admin/offers', offerData);
    return res.data;
  },

  async updateOffer(id: string, offerData: Partial<Offer>): Promise<{ offer: Offer; message: string }> {
    const res = await apiClient.put(`/admin/offers/${id}`, offerData);
    return res.data;
  },

  async deleteOffer(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete(`/admin/offers/${id}`);
    return res.data;
  },
};
