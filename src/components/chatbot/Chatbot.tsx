import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Package, 
  Search, 
  ShoppingCart, 
  ChevronRight 
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { generateResponse } from '../../services/geminiService';
import { mockProducts } from '../../data/mockProducts';

// Define types
interface MessageAction {
  type: 'product' | 'search' | 'cart';
  data: {
    id?: string;
    name?: string;
    price?: number;
    image?: string;
    query?: string;
    label: string;
  };
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  actions?: MessageAction[];
}

const Chatbot: React.FC = () => {
  // State management
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Context
  const { dispatch } = useCart();

  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Search for products based on keywords
  const searchProducts = (query: string) => {
    return mockProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.protocols?.some(protocol => protocol.toLowerCase().includes(query.toLowerCase())) ||
      product.useCases?.some(useCase => useCase.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 3);
  };

  // Enhanced response generation with product recommendations
  const enhanceResponseWithProducts = (response: string, userMessage: string): MessageAction[] => {
    const actions: MessageAction[] = [];
    const message = userMessage.toLowerCase();
    
    // Search for products based on keywords in user message or bot response
    let products: any[] = [];
    
    if (message.includes('esp32') || response.toLowerCase().includes('esp32')) {
      products = searchProducts('esp32');
    } else if (message.includes('sensor') || response.toLowerCase().includes('sensor')) {
      products = searchProducts('sensor');
    } else if (message.includes('arduino') || response.toLowerCase().includes('arduino')) {
      products = searchProducts('arduino');
    } else if (message.includes('iot') || message.includes('smart home')) {
      products = mockProducts.filter(p => 
        p.useCases?.includes('IoT') || p.useCases?.includes('Smart Home')
      ).slice(0, 3);
    } else if (message.includes('robot') || message.includes('motor')) {
      products = searchProducts('motor');
    } else if (message.includes('tool') || message.includes('multimeter')) {
      products = searchProducts('tool');
    } else if (message.includes('cheap') || message.includes('budget')) {
      products = mockProducts.filter(p => p.price < 500).slice(0, 3);
    }

    // Add product actions
    products.forEach(product => {
      actions.push({
        type: 'product',
        data: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          label: `Add ${product.name} to Cart`
        }
      });
    });

    // Add search actions based on response content
    if (response.toLowerCase().includes('esp32')) {
      actions.push({
        type: 'search',
        data: { query: 'ESP32', label: 'Browse ESP32 Boards' }
      });
    }
    
    if (response.toLowerCase().includes('sensor')) {
      actions.push({
        type: 'search',
        data: { query: 'sensors', label: 'View All Sensors' }
      });
    }
    
    if (response.toLowerCase().includes('arduino')) {
      actions.push({
        type: 'search',
        data: { query: 'Arduino', label: 'Arduino Compatible' }
      });
    }

    return actions;
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    try {
      // Format the prompt with context
      const prompt = `You are BoltBot, an assistant for Bharat Electro electronics store. 
      Help with: ${currentInput}. 
      Focus on electronics components, technical specs, project suggestions, and product recommendations.
      Be knowledgeable about Arduino, ESP32, sensors, IoT, robotics, and electronic tools.
      Keep responses concise and helpful.`;

      const botResponseText = await generateResponse(prompt);
      
      // Add bot response with enhanced actions
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponseText,
        timestamp: new Date(),
        actions: enhanceResponseWithProducts(botResponseText, currentInput)
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: unknown) {
      console.error('Error generating response:', error);
      // Add error message with fallback functionality
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: (error instanceof Error && error.message.includes('rate limit')) 
          ? 'I\'m getting a lot of requests right now. Please wait a moment and try again.'
          : 'Sorry, I had trouble processing that. How can I help you with your electronics project?',
        timestamp: new Date(),
        actions: [
          { type: 'search', data: { query: 'popular', label: 'Popular Products' } },
          { type: 'search', data: { query: 'new', label: 'New Arrivals' } },
          { type: 'search', data: { query: 'tools', label: 'Browse Tools' } }
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle adding all products to cart
  const handleAddAllProducts = useCallback((productActions: MessageAction[]) => {
    let addedCount = 0;
    const addedProducts: string[] = [];

    productActions.forEach(action => {
      if (action.type === 'product' && action.data.id) {
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
          addedCount++;
          addedProducts.push(product.name);
        }
      }
    });

    // Add confirmation message
    if (addedCount > 0) {
      const confirmation: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: `Excellent! I've added all ${addedCount} products to your cart:\n\n${addedProducts.map(name => `• ${name}`).join('\n')}\n\nAnything else you need help with?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmation]);
    }
  }, [dispatch]);

  // Handle action button clicks
  const handleActionClick = useCallback((action: MessageAction) => {
    if (action.type === 'product' && action.data.id) {
      // Find the product and add to cart
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
        
        // Add confirmation message
        const confirmation: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: `Great! I've added "${product.name}" to your cart. Anything else you need help with?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmation]);
      }
    } else if (action.type === 'search' && action.data.query) {
      // Handle search action by simulating a user message
      const searchMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `Show me ${action.data.query}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, searchMessage]);
      
      // Generate response for the search
      setTimeout(async () => {
        setIsTyping(true);
        try {
          const products = searchProducts(action.data.query || '');
          let responseContent = `Here are the ${action.data.query} products I found:`;
          
          if (products.length === 0) {
            responseContent = `I couldn't find specific products for "${action.data.query}", but let me show you some popular alternatives:`;
          }

          const botMessage: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content: responseContent,
            timestamp: new Date(),
            actions: products.length > 0 ? products.map(product => ({
              type: 'product' as const,
              data: {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                label: `Add ${product.name} to Cart`
              }
            })) : mockProducts.slice(0, 3).map(product => ({
              type: 'product' as const,
              data: {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                label: `Add ${product.name} to Cart`
              }
            }))
          };
          setMessages(prev => [...prev, botMessage]);
        } catch (error) {
          console.error('Error in search:', error);
        } finally {
          setIsTyping(false);
        }
      }, 500);
    }
  }, [dispatch]);

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 shadow-md' 
            : 'bg-[#00BFFF] hover:bg-[#0099CC] hover:scale-110 transform transition-transform shadow-lg'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-t-xl shadow-2xl border border-gray-200 flex flex-col z-40 animate-slide-up overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#000033] to-[#1a1a4e] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00BFFF] rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Bharat Electro Assistant</h3>
                <p className="text-xs text-gray-300">Online • Ready to help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white"
              aria-label="Minimize chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'bot' && (
                    <div className="flex items-center space-x-2 mb-1 ml-1">
                      <div className="w-6 h-6 bg-[#00BFFF] rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">Bharat Electro Assistant</span>
                    </div>
                  )}
                  
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-[#00BFFF] text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed text-gray-800">{message.content}</p>
                  </div>

                  {/* Action Buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {/* Individual Actions */}
                      <div className="space-y-2">
                        {message.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleActionClick(action)}
                            className={`block w-full text-left p-3 text-sm rounded-lg transition-all duration-200 ${
                              action.type === 'product' 
                                ? 'bg-white border border-gray-200 hover:border-[#00BFFF] hover:shadow-md'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                            }`}
                            aria-label={`Action: ${action.data.label}`}
                          >
                            {action.type === 'product' ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                                    <Package className="w-4 h-4 text-gray-500" />
                                  </div>
                                  <div className="text-left">
                                    <div className="font-medium text-sm text-gray-800">{action.data.name}</div>
                                    <div className="text-xs text-[#00BFFF] font-medium">₹{action.data.price?.toLocaleString('en-IN')}</div>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            ) : action.type === 'search' ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0">
                                    <Search className="w-4 h-4 text-[#00BFFF]" />
                                  </div>
                                  <span className="text-sm font-medium">{action.data.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-green-50 rounded-md flex items-center justify-center flex-shrink-0">
                                    <ShoppingCart className="w-4 h-4 text-green-500" />
                                  </div>
                                  <span className="text-sm font-medium">{action.data.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Add All Products Button */}
                      {message.actions?.some(action => action.type === 'product') && (
                        <button
                          onClick={() => handleAddAllProducts(message.actions?.filter(action => action.type === 'product') || [])}
                          className="w-full p-3 text-sm bg-[#00BFFF] text-white rounded-lg hover:bg-[#0099CC] transition-colors duration-200 font-medium flex items-center justify-center space-x-2 shadow-sm"
                          aria-label="Add all suggested products to cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add All to Cart</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-[#00BFFF] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage}>
              <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-[#00BFFF] focus-within:border-transparent transition-all duration-200">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-transparent border-0 focus:ring-0 text-sm text-gray-800 placeholder-gray-400"
                  disabled={isTyping}
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className={`p-2 mr-1 rounded-full ${
                    inputValue.trim() 
                      ? 'text-[#00BFFF] hover:bg-blue-50' 
                      : 'text-gray-400 cursor-not-allowed'
                  } transition-colors duration-200`}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Powered by Bharat Electro AI • Always learning
            </p>
          </div>
        </div>
      )}

      <style>
        {`
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
        `}
      </style>
    </>
  );
};

export default Chatbot;