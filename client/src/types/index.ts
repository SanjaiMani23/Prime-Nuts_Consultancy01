export type UserRole = 'customer' | 'admin';

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  is_active?: boolean;
  email_verified?: boolean;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
  updatedAt?: string;
  last_login_at?: string;
}

export interface WeightVariant {
  weight: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tamilName?: string;
  category: 'Nuts' | 'Dried Fruits' | 'Seeds' | 'Combos' | 'Gift Packs' | 'Snacks';
  shortDescription: string;
  description: string;
  quote?: string;
  images: string[];
  variants: WeightVariant[];
  defaultWeight: string;
  rating: number;
  reviewCount: number;
  badges?: ('Best Seller' | 'New' | 'Combo Offer' | 'Limited Offer' | 'Best Value' | 'Festival Special')[];
  ingredients?: string[];
  storage?: string;
  origin?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedWeight: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

export type OrderStatus = 'Placed' | 'Confirmed' | 'Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Cash on Delivery' | 'WhatsApp Verified';
export type PaymentMethod = 'UPI / Online' | 'Cash on Delivery' | 'Direct WhatsApp Order';

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  weight: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  guestCustomer?: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: Address;
  deliveryMethod: 'Free Tamil Nadu Delivery' | 'Store Pickup (Sundarapuram)';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  notes?: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userCity: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  tamilTitle?: string;
  code: string;
  discountPercent: number;
  minOrderValue: number;
  description: string;
  bannerImage?: string;
  linkedProductIds?: string[];
  validFrom?: string;
  validUntil: string;
  isActive: boolean;
  isBanner?: boolean;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockCount: number;
  recentOrders: Order[];
  topProducts: { name: string; salesCount: number; revenue: number }[];
}
