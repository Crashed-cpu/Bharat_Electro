import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
      },
    });

    // Send the message and get the response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Error generating response:', error);
    return 'I apologize, but I encountered an error while processing your request. Please try again later.';
  }
};

// Helper function to extract product information from the AI's response
export const extractProductInfo = (response: string) => {
  // This function can be enhanced to parse the AI's response and extract product information
  // For now, it returns null, but you can implement product extraction logic here
  return null;
};
