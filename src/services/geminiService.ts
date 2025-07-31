import { GoogleGenerativeAI } from '@google/generative-ai';

// Debug log the environment variables
console.log('Environment variables:', import.meta.env);

// Check if API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: VITE_GEMINI_API_KEY is not set in environment variables');
} else {
  console.log('Gemini API Key found, initializing...');
}

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(apiKey || '');

// System prompt to guide the AI's behavior
const SYSTEM_PROMPT = `You are a helpful assistant for an electronics e-commerce store. 
Your name is BoltBot. Be friendly, helpful, and knowledgeable about electronics products.
When asked about products, provide accurate information and relevant recommendations.
If you don't know something, be honest about it.
Keep your responses concise and to the point.`;

// Define types for chat messages
export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  parts: Array<{ text: string }>;
}

/**
 * Generate a response using Gemini AI
 * @param userMessage The user's message
 * @param chatHistory Previous messages in the conversation
 * @returns A promise that resolves to the AI's response
 */
export const generateResponse = async (
  userMessage: string,
  chatHistory: ChatMessage[]
): Promise<string> => {
  console.log('Generating response for message:', userMessage);
  console.log('Chat history length:', chatHistory.length);
  
  try {
    // Get the generative model - using the latest stable model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    // Start a chat session with the model
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: 'Hello! I\'m BoltBot, your electronics shopping assistant. How can I help you today?' }],
        },
        ...chatHistory,
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7, // Slightly lower temperature for more focused responses
        topK: 40,
        topP: 0.9, // Slightly more focused sampling
      },
    });

    // Send the message and get the response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response received from the model');
    }

    return text;
  } catch (error) {
    console.error('Error generating response:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    throw new Error('I apologize, but I encountered an error while processing your request. Please try again later.');
  }
};

