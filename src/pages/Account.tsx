import React, { useState } from 'react';
import { User, Package, Heart, Settings, LogOut, Mail, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';

const Account: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Mock order data
  const mockOrders = [
    {
      id: 'BE1234567890',
      date: '2024-01-15',
      status: 'Delivered',
      total: 1499,
      items: [
        { name: 'ESP32 DevKit V1', quantity: 2, price: 799 }
      ]
    },
    {
      id: 'BE1234567891',
      date: '2024-01-10',
      status: 'Shipped',
      total: 299,
      items: [
        { name: 'DHT22 Temperature Sensor', quantity: 1, price: 299 }
      ]
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#000033] mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access your account and view your orders.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-[#00BFFF] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#0099CC] transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
        
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#000033] mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-[#00BFFF] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#000033]">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-[#00BFFF] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
                
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#000033] mb-6">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-400" />
                        <span>{user.name}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span>+91 98765 43210</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'admin' ? 'bg-[#00BFFF] text-white' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'Customer'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#000033] mb-6">Order History</h2>
                  
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-[#000033]">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} × {item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <span className="font-semibold">Total: ₹{order.total.toLocaleString()}</span>
                          <div className="space-x-2">
                            <button className="text-[#00BFFF] hover:text-[#0099CC] text-sm font-medium transition-colors duration-200">
                              View Details
                            </button>
                            <button className="bg-[#00BFFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0099CC] transition-colors duration-200">
                              Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#000033] mb-6">Wishlist</h2>
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Your wishlist is empty</p>
                    <p className="text-sm text-gray-500 mt-2">Items you save will appear here</p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#000033] mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-[#000033] mb-2">Email Notifications</h3>
                      <p className="text-sm text-gray-600 mb-4">Choose what updates you'd like to receive</p>
                      
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          <span className="text-sm">Order updates and shipping notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          <span className="text-sm">New product announcements</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          <span className="text-sm">Promotional offers and discounts</span>
                        </label>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-[#000033] mb-2">Privacy Settings</h3>
                      <p className="text-sm text-gray-600 mb-4">Manage your data and privacy preferences</p>
                      
                      <div className="space-y-3">
                        <button className="text-[#00BFFF] hover:text-[#0099CC] text-sm font-medium transition-colors duration-200">
                          Download my data
                        </button>
                        <br />
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200">
                          Delete my account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;