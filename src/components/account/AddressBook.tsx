import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Home, Briefcase, MapPin, Check } from 'lucide-react';
import OrderService from '../../services/OrderService';
import { ShippingAddress } from '../../types/Order';

interface AddressBookProps {
  userId: string;
}

const AddressBook: React.FC<AddressBookProps> = ({ userId }) => {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<ShippingAddress, 'id' | 'userId'>>({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false,
    type: 'home'
  });

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const userAddresses = await OrderService.getUserAddresses(userId);
        setAddresses(userAddresses);
      } catch (err) {
        setError('Failed to load addresses');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAddress) {
        await OrderService.updateAddress(editingAddress.id, formData);
      } else {
        await OrderService.addAddress(userId, formData);
      }
      
      // Refresh addresses
      const updatedAddresses = await OrderService.getUserAddresses(userId);
      setAddresses(updatedAddresses);
      
      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: false,
        type: 'home'
      });
      
      setEditingAddress(null);
      setIsAddModalOpen(false);
    } catch (err) {
      setError('Failed to save address');
      console.error(err);
    }
  };

  const handleEdit = (address: ShippingAddress) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault,
      type: address.type || 'home'
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await OrderService.deleteAddress(addressId);
        const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
        setAddresses(updatedAddresses);
      } catch (err) {
        setError('Failed to delete address');
        console.error(err);
      }
    }
  };

  const setAsDefault = async (addressId: string) => {
    try {
      // First, set all addresses to non-default
      await Promise.all(
        addresses.map(addr => 
          OrderService.updateAddress(addr.id, { isDefault: addr.id === addressId })
        )
      );
      
      // Then refresh the list
      const updatedAddresses = await OrderService.getUserAddresses(userId);
      setAddresses(updatedAddresses);
    } catch (err) {
      setError('Failed to update default address');
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading addresses...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#000033]">My Addresses</h2>
        <button
          onClick={() => {
            setEditingAddress(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#00BFFF] text-white px-4 py-2 rounded-lg hover:bg-[#0099CC] transition-colors"
        >
          <Plus size={18} />
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((address) => (
          <div 
            key={address.id} 
            className={`border rounded-lg p-4 relative ${address.isDefault ? 'border-[#00BFFF] border-2' : 'border-gray-200'}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {address.type === 'home' ? (
                  <Home className="w-5 h-5 text-gray-500" />
                ) : address.type === 'work' ? (
                  <Briefcase className="w-5 h-5 text-gray-500" />
                ) : (
                  <MapPin className="w-5 h-5 text-gray-500" />
                )}
                <span className="font-medium text-[#000033]">
                  {address.type === 'home' ? 'Home' : address.type === 'work' ? 'Work' : 'Other'}
                </span>
                {address.isDefault && (
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(address)}
                  className="text-gray-500 hover:text-[#00BFFF] transition-colors"
                  aria-label="Edit address"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(address.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Delete address"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-medium">{address.fullName}</p>
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.pincode}</p>
              <p>{address.country}</p>
              <p className="mt-2">Phone: {address.phone}</p>
            </div>
            
            {!address.isDefault && (
              <button
                onClick={() => setAsDefault(address.id)}
                className="mt-3 text-sm text-[#00BFFF] hover:underline flex items-center gap-1"
              >
                <Check size={16} />
                Set as default
              </button>
            )}
          </div>
        ))}
        
        {addresses.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p className="mb-4">You haven't added any addresses yet.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#00BFFF] text-white px-4 py-2 rounded-lg hover:bg-[#0099CC] transition-colors"
            >
              <Plus size={18} />
              Add Your First Address
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Address Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#000033]">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingAddress(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'home', label: 'Home' },
                    { value: 'work', label: 'Work' },
                    { value: 'other', label: 'Other' }
                  ].map((type) => (
                    <label 
                      key={type.value}
                      className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer ${
                        formData.type === type.value 
                          ? 'border-[#00BFFF] bg-[#00BFFF]/10' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <textarea
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                    required
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#00BFFF] focus:ring-[#00BFFF] border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingAddress(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00BFFF] text-white rounded-lg hover:bg-[#0099CC]"
                >
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
