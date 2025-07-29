import React from 'react';
import { Target, Users, Award, Globe, Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Direct Import',
      description: 'We source directly from manufacturers, cutting out middlemen to offer you the best prices on quality electronics.'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every product goes through rigorous quality checks and comes with proper warranty and documentation.'
    },
    {
      icon: Headphones,
      title: 'Technical Support',
      description: 'Our team of engineers provides 24/7 technical assistance for all your project needs.'
    },
    {
      icon: CreditCard,
      title: 'GST Compliance',
      description: 'Proper GST invoicing and transparent pricing with no hidden charges or surprises.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Products' },
    { number: '50+', label: 'Cities Served' },
    { number: '4.8/5', label: 'Customer Rating' }
  ];

  const team = [
    {
      name: 'Arjun Sharma',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Electronics engineer with 10+ years in supply chain optimization'
    },
    {
      name: 'Priya Patel',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Logistics expert ensuring fast and reliable delivery across India'
    },
    {
      name: 'Rahul Kumar',
      role: 'Technical Lead',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Hardware specialist helping customers with technical queries and solutions'
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
              We're disrupting India's electronics supply chain by providing direct access to quality components
              with transparent pricing, comprehensive support, and unmatched reliability.
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
                To democratize access to quality electronics in India by eliminating traditional supply chain inefficiencies.
                We believe every maker, student, and professional deserves access to genuine components at fair prices.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Through direct partnerships with manufacturers and a commitment to transparency, we're building
                the future of electronics retail in India.
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <Target className="w-8 h-8 text-[#00BFFF] mx-auto mb-2" />
                  <p className="font-semibold text-[#000033]">Direct Sourcing</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-[#00BFFF] mx-auto mb-2" />
                  <p className="font-semibold text-[#000033]">Community First</p>
                </div>
                <div className="text-center">
                  <Award className="w-8 h-8 text-[#00BFFF] mx-auto mb-2" />
                  <p className="font-semibold text-[#000033]">Quality Assured</p>
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
            <h2 className="text-3xl font-bold text-[#000033] mb-4">Why Choose Bharat Electro?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another electronics retailer. We're your partners in innovation.
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
            <h2 className="text-3xl font-bold mb-4">Growing Together</h2>
            <p className="text-xl text-gray-300">
              Numbers that reflect our commitment to the electronics community
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
            <h2 className="text-3xl font-bold text-[#000033] mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate engineers and logistics experts working to revolutionize electronics retail in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
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
            <h2 className="text-3xl font-bold text-[#000033] mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00BFFF] rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#000033] mb-4">Transparency</h3>
              <p className="text-gray-600">
                No hidden charges, clear pricing, and honest communication in every interaction.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#00BFFF] rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#000033] mb-4">Quality</h3>
              <p className="text-gray-600">
                Every component is tested and verified to meet international standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#00BFFF] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#000033] mb-4">Community</h3>
              <p className="text-gray-600">
                Supporting makers, students, and professionals in their innovative journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;