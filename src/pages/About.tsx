import React from 'react';
import { Target, Users, Award, Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'We understand the importance of time. Our efficient logistics ensure your orders reach you in the shortest possible time.'
    },
    {
      icon: Shield,
      title: 'Original Quality',
      description: 'Every product is sourced directly from manufacturers and undergoes strict quality control to ensure you receive only the best.'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our dedicated support team is available round the clock to assist with any queries or concerns you might have.'
    },
    {
      icon: CreditCard,
      title: 'Best Prices',
      description: 'By eliminating middlemen and optimizing our supply chain, we bring you the most competitive prices without compromising on quality.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '200+', label: 'Quality Products' },
    { number: '25+', label: 'Cities Served' },
    { number: '4.9/5', label: 'Customer Rating' }
  ];

  const team = [
    {
      name: 'Ayush Saini',
      role: 'Founder & CEO',
      image: '/ceo.png',
      description: 'Visionary leader with expertise in electronics and business strategy'
    },
    {
      name: 'Manish Sahu',
      role: 'Co-Founder',
      image: 'https://via.placeholder.com/300x300?text=Manish+Sahu',
      description: 'Operations and supply chain management expert'
    },
    {
      name: 'Aashutosh Malviya',
      role: 'Co-Founder',
      image: '/aashu.jpeg',
      description: 'Technology and product development specialist'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#000033] to-[#000044] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powering India's
              <span className="text-[#00BFFF] block">Electronics Revolution</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Since 2025, we've been committed to providing original quality electronics at the lowest prices
              with fast delivery and no compromise on customer service.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#000033] mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                To provide original quality electronics at the most competitive prices, delivered with unmatched
                speed and service. We believe in complete transparency and customer satisfaction above all else.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Founded in 2025, we're building a new standard in electronics retail through innovation,
                efficiency, and a relentless focus on customer needs.
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <Target className="w-8 h-8 text-[#00BFFF] mx-auto mb-2" />
                  <p className="font-semibold text-[#000033]">Original Quality</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-[#00BFFF] mx-auto mb-2" />
                  <p className="font-semibold text-[#000033]">Lowest Price</p>
                </div>
                <div className="text-center">
                  <Award className="w-8 h-8 text-[#00BFFF] mx-auto mb-2" />
                  <p className="font-semibold text-[#000033]">Fast Delivery</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Electronics workshop"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000033]/30 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#000033] mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Original Quality. Lowest Price. Fast Delivery. No Compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-[#00BFFF]" />
                </div>
                <h3 className="text-xl font-semibold text-[#000033] mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#000033] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Journey So Far</h2>
            <p className="text-xl text-gray-300">
              Building trust and delivering value to our growing community
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#00BFFF] mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#000033] mb-4">Our Founders</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The visionaries behind our commitment to quality, price, and service excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-full h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#000033] mb-2">{member.name}</h3>
                  <p className="text-[#00BFFF] font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#000033] mb-4">Our Core Principles</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The foundation of everything we do at Bharat Electro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#000033] mb-3">Best Prices</h3>
              <p className="text-gray-600">
                Competitive pricing through optimized supply chain and direct sourcing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#000033] mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable shipping to get your orders when you need them.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#000033] mb-3">Original Quality</h3>
              <p className="text-gray-600">
                Genuine, high-quality electronics components and products.
              </p>
            </div>
          </div>
        </div>
      </section>

</div>
  );
};

export default About;