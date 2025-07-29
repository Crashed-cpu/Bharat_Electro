import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, Truck, CreditCard, Headphones } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const features = [
    { icon: Truck, label: 'Direct Import' },
    { icon: Shield, label: 'Warranty' },
    { icon: Headphones, label: 'Support' },
    { icon: CreditCard, label: 'GST Billing' }
  ];

  return (
    <footer className="bg-[#000033] text-white">
      {/* Features Bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <feature.icon className="w-5 h-5 text-[#00BFFF]" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#00BFFF] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">BE</span>
              </div>
              <span className="font-bold text-xl">Bharat Electro</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Disrupting India's electronics supply chain with affordable, direct-imported parts,
              transparent pricing, and modular flexibility for makers and professionals.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#00BFFF]" />
                <span className="text-sm">support@bharatelectro.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#00BFFF]" />
                <span className="text-sm">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#00BFFF]" />
                <span className="text-sm">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <Link to="/products" className="block text-gray-300 hover:text-[#00BFFF] transition-colors duration-200">
                All Products
              </Link>
              <Link to="/products/microcontrollers" className="block text-gray-300 hover:text-[#00BFFF] transition-colors duration-200">
                Microcontrollers
              </Link>
              <Link to="/products/sensors" className="block text-gray-300 hover:text-[#00BFFF] transition-colors duration-200">
                Sensors
              </Link>
              <Link to="/products/tools" className="block text-gray-300 hover:text-[#00BFFF] transition-colors duration-200">
                Tools
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-[#00BFFF] transition-colors duration-200">
                About Us
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <nav className="space-y-2">
              <Link to="/contact" className="block text-gray-300 hover:text-[#00BFFF] transition-colors duration-200">
                Contact Us
              </Link>
              <Link to="/policies" className="block text-gray-300 hover:text-[#00BFFF] transition-colors duration-200">
                Return Policy
              </Link>
              <Link to="/policies" className="block text-gray-300 hover:text-[#00BFFF] transition-colors duration-200">
                Shipping Info
              </Link>
              <Link to="/policies" className="block text-gray-300 hover:text-[#00BFFF] transition-colors duration-200">
                Warranty Terms
              </Link>
              <Link to="/policies" className="block text-gray-300 hover:text-[#00BFFF] transition-colors duration-200">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Bharat Electro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/policies" className="text-gray-400 hover:text-[#00BFFF] text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/policies" className="text-gray-400 hover:text-[#00BFFF] text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/policies" className="text-gray-400 hover:text-[#00BFFF] text-sm transition-colors duration-200">
                GST Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;