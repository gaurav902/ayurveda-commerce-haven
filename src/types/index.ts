
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // stored in paise
  stock: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface ProductCategory {
  product_id: string;
  category_id: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number; // stored in paise
  discount_amount: number; // stored in paise
  coupon_id: string | null;
  payment_method: 'cash_on_delivery' | 'razorpay';
  payment_status: 'pending' | 'completed' | 'failed';
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_phone: string;
  order_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number; // stored in paise
  created_at: string;
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface CartWithItems extends Cart {
  items: (CartItem & { product: Product })[];
}
