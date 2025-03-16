
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

// Products
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct(id) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => api.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });
}

export function useCategory(id) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => api.getCategory(id),
    enabled: !!id,
  });
}

// Orders
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: api.getOrders,
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => api.getOrder(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Wishlist
export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: api.getWishlist,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

// Cart
export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: api.getCart,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, quantity }) => api.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, quantity }) => api.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Addresses
export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: api.getAddresses,
  });
}

// Payment Methods
export function usePaymentMethods() {
  return useQuery({
    queryKey: ['paymentMethods'],
    queryFn: api.getPaymentMethods,
  });
}

// Coupons
export function useValidateCoupon() {
  return useMutation({
    mutationFn: api.validateCoupon,
  });
}

// Contact Form
export function useSubmitContactForm() {
  return useMutation({
    mutationFn: api.submitContactForm,
  });
}

// Newsletter
export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: api.subscribeNewsletter,
  });
}

// Admin
export function useContactSubmissions() {
  return useQuery({
    queryKey: ['contactSubmissions'],
    queryFn: api.getContactSubmissions,
  });
}

export function useNewsletterSubscribers() {
  return useQuery({
    queryKey: ['newsletterSubscribers'],
    queryFn: api.getNewsletterSubscribers,
  });
}

export function useCoupons() {
  return useQuery({
    queryKey: ['adminCoupons'],
    queryFn: api.getCoupons,
  });
}
