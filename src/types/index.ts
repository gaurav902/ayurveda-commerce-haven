
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number; // This is what's in the database
  image_url: string | null;
  created_at: string;
  updated_at: string;
  featured?: boolean;
  weight?: number;
  dimensions?: string;
  is_active?: boolean;
  benefits?: string;
  ingredients?: string;
  usage_directions?: string;
  stock_quantity?: number; // Added for compatibility with existing code
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  slug?: string; // Made optional to match database
  created_at: string;
  updated_at?: string; // Made optional to match database
}

export interface Profile {
  id: string;
  full_name: string | null;
  email?: string; // Added for compatibility with existing code
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  is_admin: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Cart {
  id: string;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CartItem {
  id: string;
  cart_id: string | null;
  product_id: string | null;
  quantity: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface CartWithItems extends Cart {
  items: (CartItem & { product: Product })[];
}

export interface Order {
  id: string;
  user_id: string | null;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_phone: string;
  order_notes: string | null;
  discount_amount: number;
  coupon_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string | null;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string | null;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  valid_from?: string; // Made optional to match database
  valid_to?: string; // Made optional to match database
  is_active?: boolean; // Made optional to match database
  active?: boolean; // Added for compatibility with database
  expires_at?: string; // Added for compatibility with database
  created_at: string | null;
  updated_at?: string | null; // Made optional to match database
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Subscriber {
  id: string;
  email: string;
  receive_notifications: boolean | null;
  created_at: string | null;
  updated_at?: string | null; // Made optional to match database
}

// New interfaces for skin and hair checkup system

export interface CheckupApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  blood_group: string;
  allergies: string;
  birthmarks: string;
  medical_conditions: string;
  previous_treatments: string;
  current_medications: string;
  skin_problem: string;
  hair_problem: string;
  want_consultation: boolean;
  report_url: string;
  selfie_urls: string[];
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface KitProduct {
  name: string;
  description: string;
  usage: string;
}

export interface KitRecommendation {
  id: string;
  application_id: string;
  diagnosis: string;
  products: KitProduct[];
  additional_notes: string;
  require_followup: boolean;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  license_number: string;
  license_url: string;
  hospital: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}
