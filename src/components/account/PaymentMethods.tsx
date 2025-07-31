import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CreditCard, DollarSign, Smartphone, Check } from 'lucide-react';
import OrderService from '../../services/OrderService';
import { PaymentMethod } from '../../types/Order';

interface PaymentMethodsProps {
  userId: string;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ userId }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Omit<PaymentMethod, 'id' | 'userId'>>({
    type: 'credit_card',
    last4: '',
    cardType: '',
    upiId: '',
    isDefault: false,
    expiryDate: '',
    nameOnCard: ''
  });
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');

  // Fetch payment methods on component mount
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setIsLoading(true);
        const methods = await OrderService.getUserPaymentMethods(userId);
        setPaymentMethods(methods);
      } catch (err) {
        setError('Failed to load payment methods');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces every 4 digits
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) return; // Limit to 16 digits
    
    // Add spaces every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(value);
    
    // Set last4 for the form
    const last4 = value.replace(/\s/g, '').slice(-4);
    setFormData(prev => ({
      ...prev,
      last4: last4 || ''
    }));
    
    // Detect card type (simplified)
    const firstDigit = value.charAt(0);
    let cardType = '';
    
    if (firstDigit === '4') cardType = 'Visa';
    else if (firstDigit === '5') cardType = 'Mastercard';
    else if (firstDigit === '3') cardType = 'American Express';
    else if (firstDigit === '6') cardType = 'Discover';
    
    setFormData(prev => ({
      ...prev,
      cardType
    }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) return; // Limit to 4 digits
    
    // Add slash after 2 digits
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    
    setFormData(prev => ({
      ...prev,
      expiryDate: value
    }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) return; // Limit to 4 digits
    setCvv(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMethod) {
        await OrderService.updatePaymentMethod(editingMethod.id, formData);
      } else {
        // In a real app, you would send the full card details to your payment processor
        // and only store the tokenized version
        await OrderService.addPaymentMethod(userId, formData);
      }
      
      // Refresh payment methods
      const updatedMethods = await OrderService.getUserPaymentMethods(userId);
      setPaymentMethods(updatedMethods);
      
      // Reset form
      setFormData({
        type: 'credit_card',
        last4: '',
        cardType: '',
        upiId: '',
        isDefault: false,
        expiryDate: '',
        nameOnCard: ''
      });
      setCardNumber('');
      setCvv('');
      setEditingMethod(null);
      setIsAddModalOpen(false);
    } catch (err) {
      setError('Failed to save payment method');
      console.error(err);
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      last4: method.last4 || '',
      cardType: method.cardType || '',
      upiId: method.upiId || '',
      isDefault: method.isDefault,
      expiryDate: method.expiryDate || '',
      nameOnCard: method.nameOnCard || ''
    });
    
    // For demo purposes, we'll just show the last 4 digits
    if (method.last4) {
      setCardNumber(`•••• •••• •••• ${method.last4}`);
    }
    
    setIsAddModalOpen(true);
  };

  const handleDelete = async (methodId: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await OrderService.deletePaymentMethod(methodId);
        const updatedMethods = paymentMethods.filter(method => method.id !== methodId);
        setPaymentMethods(updatedMethods);
      } catch (err) {
        setError('Failed to delete payment method');
        console.error(err);
      }
    }
  };

  const setAsDefault = async (methodId: string) => {
    try {
      // First, set all methods to non-default
      await Promise.all(
        paymentMethods.map(method => 
          OrderService.updatePaymentMethod(method.id, { 
            isDefault: method.id === methodId 
          })
        )
      );
      
      // Then refresh the list
      const updatedMethods = await OrderService.getUserPaymentMethods(userId);
      setPaymentMethods(updatedMethods);
    } catch (err) {
      setError('Failed to update default payment method');
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading payment methods...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  const renderPaymentMethod = (method: PaymentMethod) => {
    const isCreditCard = method.type === 'credit_card' || method.type === 'debit_card';
    
    return (
      <div 
        key={method.id} 
        className={`border rounded-lg p-4 relative ${method.isDefault ? 'border-[#00BFFF] border-2' : 'border-gray-200'}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {isCreditCard ? (
              <CreditCard className="w-5 h-5 text-gray-500" />
            ) : method.type === 'upi' ? (
              <Smartphone className="w-5 h-5 text-gray-500" />
            ) : (
              <DollarSign className="w-5 h-5 text-gray-500" />
            )}
            <span className="font-medium text-[#000033]">
              {method.type === 'credit_card' ? 'Credit Card' : 
               method.type === 'debit_card' ? 'Debit Card' :
               method.type === 'upi' ? 'UPI' : 
               method.type === 'net_banking' ? 'Net Banking' : 'Cash on Delivery'}
            </span>
            {method.isDefault && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                Default
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleEdit(method)}
              className="text-gray-500 hover:text-[#00BFFF] transition-colors"
              aria-label="Edit payment method"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => handleDelete(method.id)}
              className="text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Delete payment method"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="space-y-1 text-sm text-gray-700">
          {isCreditCard ? (
            <>
              <p className="font-medium">{method.nameOnCard || 'Cardholder Name'}</p>
              <p>•••• •••• •••• {method.last4 || '••••'}</p>
              <p>Expires: {method.expiryDate || '••/••'}</p>
              {method.cardType && <p>{method.cardType}</p>}
            </>
          ) : method.type === 'upi' ? (
            <p className="font-mono">{method.upiId || 'UPI ID'}</p>
          ) : (
            <p>No additional details available</p>
          )}
        </div>
        
        {!method.isDefault && (
          <button
            onClick={() => setAsDefault(method.id)}
            className="mt-3 text-sm text-[#00BFFF] hover:underline flex items-center gap-1"
          >
            <Check size={16} />
            Set as default
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#000033]">Payment Methods</h2>
        <button
          onClick={() => {
            setEditingMethod(null);
            setFormData({
              type: 'credit_card',
              last4: '',
              cardType: '',
              upiId: '',
              isDefault: false,
              expiryDate: '',
              nameOnCard: ''
            });
            setCardNumber('');
            setCvv('');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#00BFFF] text-white px-4 py-2 rounded-lg hover:bg-[#0099CC] transition-colors"
        >
          <Plus size={18} />
          Add Payment Method
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map(method => renderPaymentMethod(method))}
        
        {paymentMethods.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p className="mb-4">You haven't added any payment methods yet.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#00BFFF] text-white px-4 py-2 rounded-lg hover:bg-[#0099CC] transition-colors"
            >
              <Plus size={18} />
              Add Payment Method
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Payment Method Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#000033]">
                {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
              </h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingMethod(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                  disabled={!!editingMethod}
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="net_banking">Net Banking</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>
              
              {formData.type === 'credit_card' || formData.type === 'debit_card' ? (
                <>
                  <div>
                    <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      id="nameOnCard"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                      placeholder="1234 5678 9012 3456"
                      required={!editingMethod}
                      disabled={!!editingMethod}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        value={cvv}
                        onChange={handleCvvChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                  
                  {formData.cardType && (
                    <div className="text-sm text-gray-500">
                      Detected: {formData.cardType}
                    </div>
                  )}
                </>
              ) : formData.type === 'upi' ? (
                <div>
                  <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID *
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                    placeholder="yourname@upi"
                    required
                  />
                </div>
              ) : formData.type === 'net_banking' ? (
                <div className="text-center py-4 text-gray-500">
                  You'll be redirected to your bank's secure payment gateway.
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Pay with cash when your order is delivered.
                </div>
              )}
              
              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#00BFFF] focus:ring-[#00BFFF] border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default payment method
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingMethod(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00BFFF] text-white rounded-lg hover:bg-[#0099CC]"
                >
                  {editingMethod ? 'Update Payment Method' : 'Add Payment Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
