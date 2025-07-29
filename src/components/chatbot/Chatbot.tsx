import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Package, Search, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { generateResponse, ChatMessage as GeminiMessage } from '../../services/geminiService';

type MessageType = 'user' | 'bot';

interface MessageAction {
  type: 'search' | 'product' | 'cart';
  label: string;
  data?: any;
}

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  actions?: MessageAction[];
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m your electronics assistant. I can help you find components, answer technical questions, or suggest products for your projects. What are you working on?',
      timestamp: new Date(),
      actions: [
        { type: 'search', label: 'Browse ESP32 Boards', data: { query: 'ESP32', label: 'Browse ESP32 Boards' } },
        { type: 'search', label: 'View All Sensors', data: { query: 'sensors', label: 'View All Sensors' } },
        { type: 'search', label: 'Arduino Compatible', data: { query: 'Arduino', label: 'Arduino Compatible' } }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useCart();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Generate bot response using Gemini
      const chatHistory: GeminiMessage[] = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const botResponseText = await generateResponse(inputValue, chatHistory);
      
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: botResponseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating bot response:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle action button clicks
  const handleActionClick = async (action: MessageAction) => {
    // Add a message indicating the action was clicked
    const actionMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `[Action: ${action.label}]`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, actionMessage]);
    setIsTyping(true);

    try {
      // Generate a response based on the action
      const response = await generateResponse(
        `User clicked on action: ${action.label} (${action.type})`,
        messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      );

      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error handling action:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: 'Sorry, I encountered an error processing that action. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle key press for Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 bg-white rounded-lg shadow-xl flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">BoltBot Assistant</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action)}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}
      
      {/* Global styles */}
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
    </div>
  );
};

export default Chatbot;
