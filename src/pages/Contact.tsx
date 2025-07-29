import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@bharatelectro.in', 'sales@bharatelectro.in'],
      description: 'Get in touch for support or sales inquiries'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 9876543210', '+91 9876543211'],
      description: 'Mon-Sat: 9:00 AM - 7:00 PM IST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Mumbai, Maharashtra', 'India - 400001'],
      description: 'Our warehouse and office location'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon-Sat: 9:00 AM - 7:00 PM', 'Sunday: Closed'],
      description: 'We respond within 24 hours'
    }
  ];

  const faqs = [
    {
      question: 'Do you provide technical support?',
      answer: 'Yes, our team of engineers provides 24/7 technical assistance for all products.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day returns for unopened items and 7-day replacement for defective products.'
    },
    {
      question: 'Do you ship across India?',
      answer: 'Yes, we ship to all major cities across India with free shipping on orders above ₹500.'
    },
    {
      question: 'Are all products genuine?',
      answer: 'Absolutely. We source directly from manufacturers and provide authenticity certificates.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#000033] to-[#000044] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions about our products or need technical assistance? 
              We're here to help you succeed in your projects.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-6 h-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-lg font-semibold text-[#000033] mb-3">{info.title}</h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-700 font-medium">{detail}</p>
              ))}
              <p className="text-sm text-gray-500 mt-2">{info.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[#000033] mb-6">Send us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">Message Sent!</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="order-help">Order Help</option>
                    <option value="bulk-order">Bulk Order</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none transition-all duration-200 resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center bg-[#00BFFF] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#0099CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-[#000033] mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#000033] mb-3 flex items-center">
                    <MessageCircle className="w-5 h-5 text-[#00BFFF] mr-2" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8 bg-[#00BFFF]/5 rounded-lg p-6 border border-[#00BFFF]/20">
              <h3 className="text-lg font-semibold text-[#000033] mb-4">Need Immediate Help?</h3>
              <div className="space-y-3">
                <a
                  href="tel:+919876543210"
                  className="flex items-center text-[#00BFFF] hover:text-[#0099CC] transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call us at +91 9876543210
                </a>
                <a
                  href="mailto:support@bharatelectro.in"
                  className="flex items-center text-[#00BFFF] hover:text-[#0099CC] transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email: support@bharatelectro.in
                </a>
                <button className="flex items-center text-[#00BFFF] hover:text-[#0099CC] transition-colors duration-200">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with our support bot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;