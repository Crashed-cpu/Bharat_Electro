import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  Order, 
  OrderItem, 
  ShippingAddress, 
  PaymentMethod, 
  CreateOrderRequest, 
  CancelOrderRequest,
  OrderStatus
} from '../types/Order';

const ORDERS_COLLECTION = 'orders';
const ADDRESSES_COLLECTION = 'addresses';
const PAYMENT_METHODS_COLLECTION = 'paymentMethods';

class OrderService {
  // Order Methods
  static async createOrder(userId: string, orderData: CreateOrderRequest): Promise<Order> {
    try {
      // In a real app, you would validate the order data here
      // and calculate totals, taxes, etc.
      
      const orderRef = await addDoc(collection(db, ORDERS_COLLECTION), {
        ...orderData,
        userId,
        status: 'pending' as OrderStatus,
        paymentStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const orderDoc = await getDoc(orderRef);
      return { id: orderDoc.id, ...orderDoc.data() } as Order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orderDoc = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
      if (!orderDoc.exists()) {
        return null;
      }
      return { id: orderDoc.id, ...orderDoc.data() } as Order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order');
    }
  }

  static async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  static async cancelOrder(orderId: string, cancelData: CancelOrderRequest): Promise<void> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(orderRef, {
        status: 'cancelled',
        cancellationReason: cancelData.reason,
        cancellationComment: cancelData.comment,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw new Error('Failed to cancel order');
    }
  }

  // Address Methods
  static async addAddress(userId: string, address: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress> {
    try {
      const docRef = await addDoc(collection(db, ADDRESSES_COLLECTION), {
        ...address,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...address };
    } catch (error) {
      console.error('Error adding address:', error);
      throw new Error('Failed to add address');
    }
  }

  static async updateAddress(addressId: string, updates: Partial<ShippingAddress>): Promise<void> {
    try {
      const addressRef = doc(db, ADDRESSES_COLLECTION, addressId);
      await updateDoc(addressRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating address:', error);
      throw new Error('Failed to update address');
    }
  }

  static async deleteAddress(addressId: string): Promise<void> {
    try {
      // In a real app, you might want to check if this address is used in any orders
      // before allowing deletion
      await deleteDoc(doc(db, ADDRESSES_COLLECTION, addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
      throw new Error('Failed to delete address');
    }
  }

  static async getUserAddresses(userId: string): Promise<ShippingAddress[]> {
    try {
      const q = query(
        collection(db, ADDRESSES_COLLECTION),
        where('userId', '==', userId),
        orderBy('isDefault', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShippingAddress[];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw new Error('Failed to fetch addresses');
    }
  }

  // Payment Method Methods
  static async addPaymentMethod(userId: string, method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    try {
      const docRef = await addDoc(collection(db, PAYMENT_METHODS_COLLECTION), {
        ...method,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...method };
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw new Error('Failed to add payment method');
    }
  }

  static async updatePaymentMethod(methodId: string, updates: Partial<PaymentMethod>): Promise<void> {
    try {
      const methodRef = doc(db, PAYMENT_METHODS_COLLECTION, methodId);
      await updateDoc(methodRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw new Error('Failed to update payment method');
    }
  }

  static async deletePaymentMethod(methodId: string): Promise<void> {
    try {
      // In a real app, you might want to check if this payment method is used in any orders
      // before allowing deletion
      await deleteDoc(doc(db, PAYMENT_METHODS_COLLECTION, methodId));
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw new Error('Failed to delete payment method');
    }
  }

  static async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const q = query(
        collection(db, PAYMENT_METHODS_COLLECTION),
        where('userId', '==', userId),
        orderBy('isDefault', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentMethod[];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error('Failed to fetch payment methods');
    }
  }
}

export default OrderService;
