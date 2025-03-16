
import { supabase } from '@/integrations/supabase/client';

const apiBaseUrl = '/api';

// Generic fetch function
async function fetchAPI(endpoint: string, options: any = {}) {
  const url = `${apiBaseUrl}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    },
  };

  const response = await fetch(url, mergedOptions);

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  
  return data;
}

// Auth token handling
function getAuthHeader() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
}

export const api = {
  // Products
  getProducts: async () => {
    return fetchAPI('/products');
  },
  
  getProduct: async (id: string) => {
    return fetchAPI(`/products/${id}`);
  },
  
  createProduct: async (productData: any) => {
    return fetchAPI('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
      headers: getAuthHeader(),
    });
  },
  
  updateProduct: async (id: string, productData: any) => {
    return fetchAPI(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
      headers: getAuthHeader(),
    });
  },
  
  deleteProduct: async (id: string) => {
    return fetchAPI(`/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
  },
  
  // Categories
  getCategories: async () => {
    return fetchAPI('/categories');
  },
  
  getCategory: async (id: string) => {
    return fetchAPI(`/categories/${id}`);
  },
  
  createCategory: async (categoryData: any) => {
    return fetchAPI('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
      headers: getAuthHeader(),
    });
  },
  
  updateCategory: async (id: string, categoryData: any) => {
    return fetchAPI(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
      headers: getAuthHeader(),
    });
  },
  
  deleteCategory: async (id: string) => {
    return fetchAPI(`/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
  },
  
  // Orders
  getOrders: async () => {
    return fetchAPI('/orders', {
      headers: getAuthHeader(),
    });
  },
  
  getOrder: async (id: string) => {
    return fetchAPI(`/orders/${id}`, {
      headers: getAuthHeader(),
    });
  },
  
  createOrder: async (orderData: any) => {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
      headers: getAuthHeader(),
    });
  },
  
  updateOrder: async (id: string, orderData: any) => {
    return fetchAPI(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
      headers: getAuthHeader(),
    });
  },
  
  // Wishlist
  getWishlist: async () => {
    return fetchAPI('/wishlist', {
      headers: getAuthHeader(),
    });
  },
  
  addToWishlist: async (productId: string) => {
    return fetchAPI('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
      headers: getAuthHeader(),
    });
  },
  
  removeFromWishlist: async (productId: string) => {
    return fetchAPI(`/wishlist/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
  },
  
  // Cart
  getCart: async () => {
    return fetchAPI('/cart', {
      headers: getAuthHeader(),
    });
  },
  
  addToCart: async (productId: string, quantity = 1) => {
    return fetchAPI('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
      headers: getAuthHeader(),
    });
  },
  
  updateCartItem: async (itemId: string, quantity: number) => {
    return fetchAPI(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
      headers: getAuthHeader(),
    });
  },
  
  removeFromCart: async (itemId: string) => {
    return fetchAPI(`/cart/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
  },
  
  clearCart: async () => {
    return fetchAPI('/cart/clear', {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
  },
  
  // Addresses
  getAddresses: async () => {
    return fetchAPI('/addresses', {
      headers: getAuthHeader(),
    });
  },
  
  createAddress: async (addressData: any) => {
    return fetchAPI('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
      headers: getAuthHeader(),
    });
  },
  
  updateAddress: async (id: string, addressData: any) => {
    return fetchAPI(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
      headers: getAuthHeader(),
    });
  },
  
  deleteAddress: async (id: string) => {
    return fetchAPI(`/addresses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
  },
  
  // Payment Methods
  getPaymentMethods: async () => {
    return fetchAPI('/payment-methods', {
      headers: getAuthHeader(),
    });
  },
  
  createPaymentMethod: async (paymentData: any) => {
    return fetchAPI('/payment-methods', {
      method: 'POST',
      body: JSON.stringify(paymentData),
      headers: getAuthHeader(),
    });
  },
  
  updatePaymentMethod: async (id: string, paymentData: any) => {
    return fetchAPI(`/payment-methods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
      headers: getAuthHeader(),
    });
  },
  
  deletePaymentMethod: async (id: string) => {
    return fetchAPI(`/payment-methods/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
  },
  
  // Coupons
  validateCoupon: async (code: string) => {
    return fetchAPI(`/coupons/validate`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },
  
  // Contact
  submitContactForm: async (contactData: any) => {
    return fetchAPI('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
  
  // Newsletter
  subscribeNewsletter: async (email: string, receiveNotifications = true) => {
    return fetchAPI('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email, receive_notifications: receiveNotifications }),
    });
  },
  
  // Admin
  getContactSubmissions: async () => {
    return fetchAPI('/admin/contact-submissions', {
      headers: getAuthHeader(),
    });
  },
  
  updateContactSubmission: async (id: string, data: any) => {
    return fetchAPI(`/admin/contact-submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: getAuthHeader(),
    });
  },
  
  getNewsletterSubscribers: async () => {
    return fetchAPI('/admin/newsletter-subscribers', {
      headers: getAuthHeader(),
    });
  },
  
  getCoupons: async () => {
    return fetchAPI('/admin/coupons', {
      headers: getAuthHeader(),
    });
  },
  
  createCoupon: async (couponData: any) => {
    return fetchAPI('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
      headers: getAuthHeader(),
    });
  },
  
  updateCoupon: async (id: string, couponData: any) => {
    return fetchAPI(`/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(couponData),
      headers: getAuthHeader(),
    });
  },
  
  deleteCoupon: async (id: string) => {
    return fetchAPI(`/admin/coupons/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
  },
};
