import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: VITE_GEMINI_API_KEY is not set in environment variables');
}

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(apiKey || '');

// System prompt to guide the AI's behavior (kept concise)
const SYSTEM_PROMPT = `You are BoltBot, a helpful assistant for an electronics e-commerce store. 
Be concise and focus on electronics products, specifications, and recommendations.`;

// Simple retry function with exponential backoff
const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (maxRetries <= 0) throw error;
    
    // If rate limited, wait before retrying
    const retryAfter = error?.response?.headers?.['retry-after'] || delay;
    console.log(`Retrying after ${retryAfter}ms... (${maxRetries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    
    return withRetry(fn, maxRetries - 1, delay * 2);
  }
};

/**
 * Generate a response using Gemini AI
 * @param userMessage The user's message
 * @returns A promise that resolves to the AI's response
 */
export const generateResponse = async (
  userMessage: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  return withRetry(async () => {
    try {
      // Use the latest stable model
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro-latest',
        generationConfig: {
          maxOutputTokens: 500, // Reduced from 1000
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
        },
      });

      // Combine system prompt with user message
      const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`;
      
      // Generate content directly without chat history
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from model');
      }

      return text;
    } catch (error: unknown) {
      console.error('Error in generateResponse:', error);
      if (error instanceof Error && error.message.includes('quota')) {
        throw new Error('I\'ve reached my rate limit. Please try again in a moment.');
      }
      throw new Error('Sorry, I encountered an error. Please try again.');
    }
  });
};

