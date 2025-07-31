import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Package, Heart, Settings, User as UserIcon, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';

// Import components
import OrderHistory from '../components/account/OrderHistory';
import AddressBook from '../components/account/AddressBook';

// Interface for the form data
interface UserFormData {
  displayName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}



const Account: React.FC = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    displayName: '',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  useEffect(() => {
    if (user) {
      // In a real app, you would fetch the user's profile from Firestore here
      const phoneNumber = 'phoneNumber' in user ? (user as any).phoneNumber : '';
      
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: phoneNumber || '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
      });
    }
  }, [user]);

  // Mock order data - moved to OrderHistory component

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleSave = async () => {
    if (!user) return;
    
    try {
      // In a real app, we would update the user's profile in Firestore here
      // For now, we'll just update the local state
      console.log('Updating profile:', {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        // Address would be saved to user's profile in Firestore
      });
      
      // In a real app, we would update the user's profile in Firestore here
      // await updateProfile(user.uid, {
      //   displayName: formData.displayName,
      //   phoneNumber: formData.phoneNumber,
      //   // ... other profile fields
      // });
      
      setIsEditing(false);
      
      // Show success message
      // TODO: Replace with toast notification
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      // TODO: Show error toast/message to user
      alert('Failed to update profile. Please try again.');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow numbers and limit to 10 digits
    if (/^\d{0,10}$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        phoneNumber: value
      }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#000033] mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access your account and view your orders.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-[#00BFFF] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#0099CC] transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  const userPhoneNumber = user && 'phoneNumber' in user ? (user as any).phoneNumber : '';

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
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#000033]">{user.displayName || 'User'}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
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
                  <h2 className="text-2xl font-bold text-[#000033] mb-6">My Profile</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                            <span>{user.displayName || 'User'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handlePhoneChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                            placeholder="+91 "
                          />
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span>{userPhoneNumber || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      {isEditing && (
                        <div className="space-y-4 pt-4">
                          <h3 className="text-lg font-semibold text-[#000033]">Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                              <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                              <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                              <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                              <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                              <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-4 pt-4">
                      {isEditing ? (
                        <>
                          <button 
                            className="flex-1 bg-[#00BFFF] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#0099CC] transition-colors duration-200"
                            onClick={handleSave}
                          >
                            Save Changes
                          </button>
                          <button 
                            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button 
                          className="flex-1 bg-[#00BFFF] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#0099CC] transition-colors duration-200"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#000033] mb-6">Order History</h2>
                  <OrderHistory userId={user?.uid || ''} />
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#000033] mb-6">My Addresses</h2>
                  <AddressBook userId={user?.uid || ''} />
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