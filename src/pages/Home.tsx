import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Truck, Shield, Headphones, CreditCard, Zap, Users, Globe, Star } from 'lucide-react';

const Home: React.FC = () => {
  const [currentSearchTerm, setCurrentSearchTerm] = useState(0);
  const searchTerms = ['ESP32', 'Sensors', 'Multimeters', 'Arduino', 'Raspberry Pi'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSearchTerm((prev) => (prev + 1) % searchTerms.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Truck, label: 'Direct Import', description: 'Straight from manufacturers' },
    { icon: Shield, label: 'Warranty', description: 'Reliable product guarantees' },
    { icon: Headphones, label: 'Support', description: '24/7 technical assistance' },
    { icon: CreditCard, label: 'GST Billing', description: 'Proper invoicing' }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Customers' },
    { icon: Globe, value: '500+', label: 'Products' },
    { icon: Star, value: '4.8/5', label: 'Rating' },
    { icon: Zap, value: '24h', label: 'Fast Shipping' }
  ];

  const categories = [
    {
      name: 'Microcontrollers',
      image: 'https://images.pexels.com/photos/442154/pexels-photo-442154.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'ESP32, Arduino, STM32 and more',
      href: '/products/microcontrollers'
    },
    {
      name: 'Sensors',
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Temperature, motion, pressure sensors',
      href: '/products/sensors'
    },
    {
      name: 'Development Tools',
      image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Multimeters, oscilloscopes, soldering',
      href: '/products/tools'
    },
    {
      name: 'Components',
      image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Resistors, capacitors, ICs',
      href: '/products/components'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#000033] to-[#000044] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                  Powering India's
                  <span className="text-[#00BFFF] block">Maker Revolution</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-lg">
                  Direct-imported electronics with transparent pricing, 
                  modular flexibility, and uncompromising quality for makers, 
                  students, and professionals.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-[#00BFFF] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#0099CC] transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center group"
                >
                  Browse Now
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#000033] transition-all duration-300 flex items-center justify-center"
                >
                  Get Help
                </Link>
              </div>
            </div>

            {/* Right Side - Animated Search */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerms[currentSearchTerm]}
                    readOnly
                    className="w-full bg-white text-[#000033] px-6 py-4 rounded-lg text-lg font-medium shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#000033] w-6 h-6" />
                </div>
                <p className="text-center text-gray-300 mt-4">
                  Search from 500+ products
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-[#00BFFF] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-[#000033] mb-2">{feature.label}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000033] mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of electronics for every project and skill level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.href}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="aspect-w-16 aspect-h-12 relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-200 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#000033] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-[#00BFFF] mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of makers, students, and professionals who trust Bharat Electro
            for their electronics needs.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-white text-[#00BFFF] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg group"
          >
            Explore Products
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;