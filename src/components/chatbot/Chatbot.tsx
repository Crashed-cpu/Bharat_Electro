import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Package, Search, ShoppingCart } from 'lucide-react';
import { mockProducts } from '../../data/mockProducts';
import { useCart } from '../../contexts/CartContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  actions?: {
    type: 'product' | 'search' | 'cart';
    data: any;
  }[];
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m your electronics assistant. I can help you find components, answer technical questions, or suggest products for your projects. What are you working on?',
      timestamp: new Date(),
      actions: [
        { type: 'search', data: { query: 'ESP32', label: 'Browse ESP32 Boards' } },
        { type: 'search', data: { query: 'sensors', label: 'View All Sensors' } },
        { type: 'search', data: { query: 'Arduino', label: 'Arduino Compatible' } }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    const messageId = Date.now().toString();
    
    // Search for products based on keywords
    const searchProducts = (query: string) => {
      return mockProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.protocols?.some(protocol => protocol.toLowerCase().includes(query)) ||
        product.useCases?.some(useCase => useCase.toLowerCase().includes(query))
      ).slice(0, 3);
    };

    // Intent detection
    if (message.includes('esp32') || message.includes('microcontroller')) {
      const products = searchProducts('esp32');
      return {
        id: messageId,
        type: 'bot',
        content: 'Great choice! ESP32 is perfect for IoT projects. Here are our top ESP32 development boards:',
        timestamp: new Date(),
        actions: products.map(product => ({
          type: 'product' as const,
          data: { 
            id: product.id, 
            name: product.name, 
            price: product.price,
            image: product.image
          }
        }))
      };
    }

    if (message.includes('sensor') || message.includes('temperature') || message.includes('humidity')) {
      const products = searchProducts('sensor');
      return {
        id: messageId,
        type: 'bot',
        content: 'Sensors are essential for monitoring and automation! Here are some popular options:',
        timestamp: new Date(),
        actions: products.map(product => ({
          type: 'product' as const,
          data: { 
            id: product.id, 
            name: product.name, 
            price: product.price,
            image: product.image
          }
        }))
      };
    }

    if (message.includes('arduino') || message.includes('uno')) {
      const products = searchProducts('arduino');
      return {
        id: messageId,
        type: 'bot',
        content: 'Arduino is perfect for beginners and prototyping! Check out these boards:',
        timestamp: new Date(),
        actions: products.map(product => ({
          type: 'product' as const,
          data: { 
            id: product.id, 
            name: product.name, 
            price: product.price,
            image: product.image
          }
        }))
      };
    }

    if (message.includes('iot') || message.includes('smart home') || message.includes('home automation')) {
      const products = mockProducts.filter(p => 
        p.useCases?.includes('IoT') || p.useCases?.includes('Smart Home')
      ).slice(0, 3);
      return {
        id: messageId,
        type: 'bot',
        content: 'IoT projects are exciting! Here are components perfect for smart home automation:',
        timestamp: new Date(),
        actions: products.map(product => ({
          type: 'product' as const,
          data: { 
            id: product.id, 
            name: product.name, 
            price: product.price,
            image: product.image
          }
        }))
      };
    }

    if (message.includes('robot') || message.includes('motor') || message.includes('servo')) {
      const products = searchProducts('motor');
      return {
        id: messageId,
        type: 'bot',
        content: 'Building robots is awesome! Here are components for your robotics project:',
        timestamp: new Date(),
        actions: products.map(product => ({
          type: 'product' as const,
          data: { 
            id: product.id, 
            name: product.name, 
            price: product.price,
            image: product.image
          }
        }))
      };
    }

    if (message.includes('tool') || message.includes('multimeter') || message.includes('soldering')) {
      const products = searchProducts('tool');
      return {
        id: messageId,
        type: 'bot',
        content: 'Good tools are essential for any electronics work! Here are our recommended tools:',
        timestamp: new Date(),
        actions: products.map(product => ({
          type: 'product' as const,
          data: { 
            id: product.id, 
            name: product.name, 
            price: product.price,
            image: product.image
          }
        }))
      };
    }

    if (message.includes('help') || message.includes('support') || message.includes('problem')) {
      return {
        id: messageId,
        type: 'bot',
        content: 'I\'m here to help! You can:\n\n• Ask about specific components\n• Get product recommendations\n• Check compatibility\n• Get technical specifications\n\nWhat specific help do you need?',
        timestamp: new Date(),
        actions: [
          { type: 'search', data: { query: 'popular', label: 'Popular Products' } },
          { type: 'search', data: { query: 'new', label: 'New Arrivals' } }
        ]
      };
    }

    if (message.includes('price') || message.includes('cost') || message.includes('cheap') || message.includes('budget')) {
      const cheapProducts = mockProducts.filter(p => p.price < 500).slice(0, 3);
      return {
        id: messageId,
        type: 'bot',
        content: 'Looking for budget-friendly options? Here are some great components under ₹500:',
        timestamp: new Date(),
        actions: cheapProducts.map(product => ({
          type: 'product' as const,
          data: { 
            id: product.id, 
            name: product.name, 
            price: product.price,
            image: product.image
          }
        }))
      };
    }

    // Generic search fallback
    const searchTerms = message.split(' ').filter(word => word.length > 2);
    let foundProducts: any[] = [];
    
    for (const term of searchTerms) {
      foundProducts = searchProducts(term);
      if (foundProducts.length > 0) break;
    }

    if (foundProducts.length > 0) {
      return {
        id: messageId,
        type: 'bot',
        content: `I found some products related to "${userMessage}". Here are the top matches:`,
        timestamp: new Date(),
        actions: foundProducts.map(product => ({
          type: 'product' as const,
          data: { 
            id: product.id, 
            name: product.name, 
            price: product.price,
            image: product.image
          }
        }))
      };
    }

    // Default response
    return {
      id: messageId,
      type: 'bot',
      content: 'I\'d be happy to help you find the right components! Could you tell me more about your project? For example:\n\n• What type of project are you building?\n• What functionality do you need?\n• Any specific requirements or constraints?',
      timestamp: new Date(),
      actions: [
        { type: 'search', data: { query: 'microcontrollers', label: 'Browse Microcontrollers' } },
        { type: 'search', data: { query: 'sensors', label: 'Browse Sensors' } },
        { type: 'search', data: { query: 'tools', label: 'Browse Tools' } }
      ]
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.content);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (action: any) => {
    if (action.type === 'product') {
      // Add to cart
      const product = mockProducts.find(p => p.id === action.data.id);
      if (product) {
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock
          }
        });
        
        const confirmMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: `Great! I've added "${product.name}" to your cart. Anything else you need help with?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmMessage]);
      }
    } else if (action.type === 'search') {
      // Simulate search action
      const searchMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `Show me ${action.data.query}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, searchMessage]);
      
      setTimeout(() => {
        const botResponse = generateBotResponse(action.data.query);
        setMessages(prev => [...prev, botResponse]);
      }, 500);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-[#00BFFF] hover:bg-[#0099CC] hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-40 animate-slide-up">
          {/* Chat Header */}
          <div className="bg-[#000033] text-white p-4 rounded-t-lg flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#00BFFF] rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Bharat Electro Assistant</h3>
              <p className="text-xs text-gray-300">Online • Ready to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'bot' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-[#00BFFF] rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-gray-500">Assistant</span>
                    </div>
                  )}
                  
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-[#00BFFF] text-white ml-2'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>

                  {/* Action Buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action)}
                          className="block w-full text-left p-2 text-xs bg-white border border-gray-300 rounded hover:border-[#00BFFF] hover:text-[#00BFFF] transition-colors duration-200"
                        >
                          {action.type === 'product' ? (
                            <div className="flex items-center space-x-2">
                              <Package className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{action.data.name}</div>
                                <div className="text-[#00BFFF]">₹{action.data.price} • Add to Cart</div>
                              </div>
                            </div>
                          ) : action.type === 'search' ? (
                            <div className="flex items-center space-x-2">
                              <Search className="w-4 h-4" />
                              <span>{action.data.label}</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <ShoppingCart className="w-4 h-4" />
                              <span>{action.data.label}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-[#00BFFF] rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg ml-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about components, projects, or technical specs..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent outline-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-2 bg-[#00BFFF] text-white rounded-lg hover:bg-[#0099CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Bharat Electro AI • Always learning
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Chatbot;