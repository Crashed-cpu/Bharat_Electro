import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, Users, ShoppingCart, Settings, Bell, Download, Plus, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockProducts } from '../data/mockProducts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user || user.role === 'customer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#000033] mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#000033] text-white min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-gray-300 text-sm">Bharat Electro</p>
          </div>
          
          <nav className="mt-6">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-[#00BFFF] hover:text-white transition-colors duration-200 ${
                  location.pathname === item.path ? 'bg-[#00BFFF] text-white' : ''
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/customers" element={<CustomersManagement />} />
            <Route path="/settings" element={<SettingsManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  const stats = [
    { label: 'Total Orders', value: '1,234', change: '+12%', color: 'bg-blue-500' },
    { label: 'Revenue', value: '₹2,45,678', change: '+8%', color: 'bg-green-500' },
    { label: 'Products', value: '456', change: '+3%', color: 'bg-purple-500' },
    { label: 'Customers', value: '2,891', change: '+15%', color: 'bg-orange-500' }
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#000033]">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-[#00BFFF] text-white px-4 py-2 rounded-lg hover:bg-[#0099CC] transition-colors duration-200">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className={`w-3 h-3 ${stat.color} rounded-full mr-3`}></div>
              <span className="text-gray-600 text-sm">{stat.label}</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-[#000033]">{stat.value}</span>
              <span className="text-green-600 text-sm ml-2">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#000033] mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Order #BE{Date.now() + i}</p>
                  <p className="text-sm text-gray-600">₹{(Math.random() * 5000 + 500).toFixed(0)}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  New
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#000033] mb-4">Low Stock Alerts</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">ESP32 DevKit V1</p>
                  <p className="text-sm text-red-600">Only 5 units left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersManagement: React.FC = () => {
  const mockOrders = [
    { id: 'BE1234567890', customer: 'John Doe', date: '2024-01-15', status: 'Processing', total: 1499 },
    { id: 'BE1234567891', customer: 'Jane Smith', date: '2024-01-14', status: 'Shipped', total: 899 },
    { id: 'BE1234567892', customer: 'Mike Johnson', date: '2024-01-13', status: 'Delivered', total: 1299 }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#000033]">Orders Management</h1>
        <button className="flex items-center space-x-2 bg-[#00BFFF] text-white px-4 py-2 rounded-lg hover:bg-[#0099CC] transition-colors duration-200">
          <Download className="w-4 h-4" />
          <span>Export Orders</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#000033]">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">₹{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-[#00BFFF] hover:text-[#0099CC]">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductsManagement: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#000033]">Products Management</h1>
        <button className="flex items-center space-x-2 bg-[#00BFFF] text-white px-4 py-2 rounded-lg hover:bg-[#0099CC] transition-colors duration-200">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockProducts.slice(0, 10).map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#000033] truncate max-w-xs">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">₹{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-[#00BFFF] hover:text-[#0099CC]">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CustomersManagement: React.FC = () => {
  const mockCustomers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', orders: 5, totalSpent: 12450 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', orders: 3, totalSpent: 8790 },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', orders: 8, totalSpent: 15670 }
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#000033]">Customers Management</h1>
        <button className="flex items-center space-x-2 bg-[#00BFFF] text-white px-4 py-2 rounded-lg hover:bg-[#0099CC] transition-colors duration-200">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#000033]">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">₹{customer.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-[#00BFFF] hover:text-[#0099CC]">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SettingsManagement: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#000033] mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#000033] mb-4">Site Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input
                type="text"
                defaultValue="Bharat Electro"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue="support@bharatelectro.in"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#000033] mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm">Email alerts for new orders</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm">Low stock alerts</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-sm">Weekly sales reports</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;