import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Shield, Truck, RotateCcw, CreditCard, Phone, Mail } from 'lucide-react';

const Policies: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>('shipping');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const PolicySection: React.FC<{
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    children: React.ReactNode;
  }> = ({ id, title, icon: Icon, children }) => {
    const isActive = activeSection === id;
    
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-6 h-6 text-[#00BFFF]" />
            <h2 className="text-xl font-semibold text-[#000033]">{title}</h2>
          </div>
          {isActive ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {isActive && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="pt-4 prose prose-gray max-w-none">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#000033] to-[#000044] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Policies & Terms</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Clear, transparent policies that protect your rights as our customer
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          
          <PolicySection id="shipping" title="Shipping & Delivery" icon={Truck}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Shipping Options</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><strong>Standard Shipping:</strong> 3-5 business days - FREE on orders above ₹500</li>
                  <li><strong>Express Shipping:</strong> 1-2 business days - ₹99 (FREE on orders above ₹2000)</li>
                  <li><strong>Same-Day Delivery:</strong> Available in Mumbai, Delhi, Bangalore - ₹199</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Delivery Areas</h3>
                <p className="text-gray-600 mb-2">We deliver to all major cities and towns across India through our logistics partners:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Pan-India delivery to 19,000+ pincodes</li>
                  <li>Cash on Delivery available for orders up to ₹5,000</li>
                  <li>Real-time tracking provided via SMS and email</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Order Processing Time</h3>
                <p className="text-gray-600">
                  Orders placed before 2:00 PM IST on business days are processed the same day. 
                  Orders placed after 2:00 PM or on weekends/holidays are processed the next business day.
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection id="returns" title="Returns & Refunds" icon={RotateCcw}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">30-Day Return Policy</h3>
                <p className="text-gray-600 mb-2">
                  We offer a hassle-free 30-day return policy for all products. Items must be:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>In original packaging and condition</li>
                  <li>Unopened and unused (unless defective)</li>
                  <li>Include all accessories and documentation</li>
                  <li>Have the original invoice/receipt</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Refund Process</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Refunds are processed within 5-7 business days after we receive the returned item</li>
                  <li>Original payment method will be credited</li>
                  <li>Shipping charges are non-refundable (except for defective items)</li>
                  <li>Return shipping costs are borne by the customer unless the item is defective</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Non-Returnable Items</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Custom or personalized products</li>
                  <li>Software licenses and digital products</li>
                  <li>Items damaged due to misuse or normal wear</li>
                </ul>
              </div>
            </div>
          </PolicySection>

          <PolicySection id="warranty" title="Warranty Terms" icon={Shield}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Standard Warranty</h3>
                <p className="text-gray-600 mb-2">All products come with manufacturer warranty:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><strong>Electronics Components:</strong> 6 months to 1 year</li>
                  <li><strong>Development Boards:</strong> 1 year</li>
                  <li><strong>Tools & Equipment:</strong> 1-2 years</li>
                  <li><strong>Sensors & Modules:</strong> 6 months</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Warranty Coverage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-[#000033] mb-2">Covered:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                      <li>Manufacturing defects</li>
                      <li>Component failure under normal use</li>
                      <li>Power-related issues</li>
                      <li>Functional defects</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#000033] mb-2">Not Covered:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                      <li>Physical damage or misuse</li>
                      <li>Water/liquid damage</li>
                      <li>Damage from incorrect voltage</li>
                      <li>Normal wear and tear</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Warranty Claims</h3>
                <p className="text-gray-600">
                  To claim warranty, contact our support team with your order number and description of the issue. 
                  We provide repair, replacement, or refund based on the nature of the defect.
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection id="payment" title="Payment & Pricing" icon={CreditCard}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Accepted Payment Methods</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><strong>UPI:</strong> All major UPI apps (GPay, PhonePe, Paytm, etc.)</li>
                  <li><strong>Credit/Debit Cards:</strong> Visa, Mastercard, RuPay, American Express</li>
                  <li><strong>Net Banking:</strong> All major Indian banks</li>
                  <li><strong>Digital Wallets:</strong> Paytm, Amazon Pay, Mobikwik</li>
                  <li><strong>Cash on Delivery:</strong> Available for orders up to ₹5,000</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Pricing Policy</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>All prices are in Indian Rupees (₹) and include GST</li>
                  <li>Prices are subject to change without prior notice</li>
                  <li>The price charged will be the price displayed at the time of order confirmation</li>
                  <li>We reserve the right to cancel orders if pricing errors occur</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">GST & Invoicing</h3>
                <p className="text-gray-600">
                  We provide proper GST invoices for all orders. Our GSTIN is displayed on all invoices. 
                  Business customers can claim Input Tax Credit (ITC) on their purchases.
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection id="privacy" title="Privacy Policy" icon={Shield}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Information We Collect</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Name, email address, phone number, and shipping address</li>
                  <li>Payment information (securely processed by payment gateways)</li>
                  <li>Order history and preferences</li>
                  <li>Website usage data and cookies for better user experience</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Process and fulfill your orders</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Provide customer support</li>
                  <li>Improve our products and services</li>
                  <li>Send promotional offers (with your consent)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Data Security</h3>
                <p className="text-gray-600">
                  We implement industry-standard security measures to protect your personal information. 
                  Your payment data is processed securely through encrypted connections and is never stored on our servers.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Your Rights</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </div>
            </div>
          </PolicySection>

          <PolicySection id="terms" title="Terms of Service" icon={Shield}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Acceptance of Terms</h3>
                <p className="text-gray-600">
                  By using our website and services, you agree to be bound by these terms and conditions. 
                  If you do not agree with any part of these terms, please do not use our services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Product Information</h3>
                <p className="text-gray-600">
                  We strive to provide accurate product information, but we do not warrant that product descriptions 
                  or other content is accurate, complete, reliable, or error-free. Colors and specifications may vary 
                  from those shown on the website.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Limitation of Liability</h3>
                <p className="text-gray-600">
                  Our liability is limited to the purchase price of the product. We are not liable for any indirect, 
                  incidental, or consequential damages arising from the use of our products.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000033] mb-2">Governing Law</h3>
                <p className="text-gray-600">
                  These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction 
                  of the courts in Mumbai, Maharashtra.
                </p>
              </div>
            </div>
          </PolicySection>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#000033] mb-6 text-center">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-[#00BFFF]" />
              </div>
              <h3 className="font-semibold text-[#000033] mb-2">Email Support</h3>
              <p className="text-gray-600 mb-2">support@bharatelectro.in</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-[#00BFFF]" />
              </div>
              <h3 className="font-semibold text-[#000033] mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-2">+91 9876543210</p>
              <p className="text-sm text-gray-500">Mon-Sat: 9:00 AM - 7:00 PM IST</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Last updated: January 2024 | These policies are subject to change. 
              We will notify customers of any significant changes via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;