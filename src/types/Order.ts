import { Product } from './Product';

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  type?: 'home' | 'work' | 'other';
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'cod';
  last4?: string;
  cardType?: string;
  upiId?: string;
  isDefault: boolean;
  expiryDate?: string;
  nameOnCard?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Omit<ShippingAddress, 'id' | 'isDefault'>;
  paymentMethod: Omit<PaymentMethod, 'id' | 'isDefault'>;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
}

export interface OrderHistoryItem extends Order {
  canCancel: boolean;
  canReturn: boolean;
  returnWindowEnds?: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount?: number;
  grandTotal: number;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddressId: string;
  paymentMethodId: string;
  notes?: string;
}

export interface CancelOrderRequest {
  orderId: string;
  reason: string;
  comment?: string;
}
