import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import OrderService from '../../services/OrderService';
import { Order, OrderStatus } from '../../types/Order';
import { format } from 'date-fns';

interface OrderHistoryProps {
  userId: string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancelingOrder, setCancelingOrder] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelComment, setCancelComment] = useState('');

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const userOrders = await OrderService.getUserOrders(userId);
        // Sort orders by date (newest first)
        const sortedOrders = [...userOrders].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } catch (err) {
        setError('Failed to load order history');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'N/A';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!cancelReason.trim()) {
      alert('Please select a reason for cancellation');
      return;
    }

    try {
      await OrderService.cancelOrder(orderId, {
        orderId, // Include the orderId in the request body as required by the interface
        reason: cancelReason,
        comment: cancelComment
      });
      
      // Update the order status in the local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as OrderStatus } 
          : order
      ));
      
      // Reset the cancel form
      setCancelingOrder(null);
      setCancelReason('');
      setCancelComment('');
    } catch (err) {
      setError('Failed to cancel order');
      console.error(err);
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00BFFF]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
        <div className="mt-6">
          <a
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#00BFFF] hover:bg-[#0099CC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00BFFF]"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#000033]">Order History</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center cursor-pointer hover:bg-gray-100"
              onClick={() => toggleOrderDetails(order.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(order.total)}
                </span>
                {expandedOrder === order.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            
            {expandedOrder === order.id && (
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-16 w-16 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.image || '/placeholder-product.jpg'}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                            <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Summary */}
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Subtotal</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Shipping</span>
                          <span>{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Tax</span>
                          <span>{formatCurrency(order.tax)}</span>
                        </div>
                        <div className="flex justify-between text-base font-medium text-gray-900 pt-2 border-t border-gray-200 mt-2">
                          <span>Total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Shipping Address</h4>
                          <div className="mt-1 text-sm text-gray-600">
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                            <p>{order.shippingAddress.country}</p>
                            <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Payment Method</h4>
                          <div className="mt-1 text-sm text-gray-600">
                            {order.paymentMethod.type === 'credit_card' || order.paymentMethod.type === 'debit_card' ? (
                              <>
                                <p>{order.paymentMethod.cardType} ending in {order.paymentMethod.last4}</p>
                                <p>Expires {order.paymentMethod.expiryDate}</p>
                              </>
                            ) : order.paymentMethod.type === 'upi' ? (
                              <p>UPI: {order.paymentMethod.upiId}</p>
                            ) : order.paymentMethod.type === 'net_banking' ? (
                              <p>Net Banking</p>
                            ) : (
                              <p>Cash on Delivery</p>
                            )}
                            <p className="mt-1 capitalize">Status: {order.paymentStatus}</p>
                          </div>
                        </div>
                        
                        {order.trackingNumber && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Tracking Information</h4>
                            <div className="mt-1 text-sm text-gray-600">
                              <p>Tracking #: {order.trackingNumber}</p>
                              {order.trackingUrl && (
                                <a 
                                  href={order.trackingUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#00BFFF] hover:underline"
                                >
                                  Track Package
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {order.estimatedDelivery && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Estimated Delivery</h4>
                            <p className="mt-1 text-sm text-gray-600">
                              {formatDate(order.estimatedDelivery)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Order Actions */}
                    <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                      {order.status === 'pending' || order.status === 'processing' ? (
                        <button
                          type="button"
                          onClick={() => setCancelingOrder(order.id)}
                          className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00BFFF]"
                        >
                          Cancel Order
                        </button>
                      ) : order.status === 'delivered' ? (
                        <button
                          type="button"
                          className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00BFFF]"
                        >
                          Return or Exchange
                        </button>
                      ) : null}
                      
                      <button
                        type="button"
                        className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00BFFF]"
                      >
                        View Invoice
                      </button>
                      
                      <button
                        type="button"
                        className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00BFFF]"
                      >
                        Buy Again
                      </button>
                    </div>
                    
                    {/* Cancel Order Form */}
                    {cancelingOrder === order.id && (
                      <div className="mt-6 p-4 bg-red-50 rounded-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Cancel Order</h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
                              
                              <div className="mt-4 space-y-3">
                                <div>
                                  <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700">
                                    Reason for cancellation *
                                  </label>
                                  <select
                                    id="cancelReason"
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00BFFF] focus:border-[#00BFFF] sm:text-sm rounded-md"
                                    required
                                  >
                                    <option value="">Select a reason</option>
                                    <option value="found_cheaper_elsewhere">Found cheaper elsewhere</option>
                                    <option value="changed_mind">Changed my mind</option>
                                    <option value="shipping_too_long">Shipping takes too long</option>
                                    <option value="ordered_wrong_item">Ordered wrong item</option>
                                    <option value="other">Other reason</option>
                                  </select>
                                </div>
                                
                                <div>
                                  <label htmlFor="cancelComment" className="block text-sm font-medium text-gray-700">
                                    Additional comments (optional)
                                  </label>
                                  <textarea
                                    id="cancelComment"
                                    rows={3}
                                    value={cancelComment}
                                    onChange={(e) => setCancelComment(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00BFFF] focus:border-[#00BFFF] sm:text-sm"
                                    placeholder="Please provide any additional details..."
                                  />
                                </div>
                                
                                <div className="flex space-x-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCancelingOrder(null);
                                      setCancelReason('');
                                      setCancelComment('');
                                    }}
                                    className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                  >
                                    Go Back
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="flex-1 bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  >
                                    Confirm Cancellation
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
