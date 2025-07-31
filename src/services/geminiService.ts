import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

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

// Enhanced retry function with exponential backoff and better rate limit handling
const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3, // Increased max retries
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (maxRetries <= 0) {
      console.error('Max retries reached:', error);
      throw error;
    }
    
    // Extract retry info from error or use default
    let waitTime = delay;
    const errorMessage = error.message || 'Unknown error';
    
    // Check for rate limit or quota exceeded errors
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate')) {
      // Extract retry-after header if available
      const retryAfter = error?.response?.headers?.['retry-after'] || 
                        error?.response?.data?.error?.details?.[0]?.retryInfo?.retryDelay?.seconds || 
                        5; // Default to 5 seconds for rate limits
      
      waitTime = parseInt(retryAfter, 10) * 1000 || delay;
      console.warn(`Rate limited. Retrying after ${waitTime}ms... (${maxRetries} attempts left)`);
    } else {
      console.warn(`Error occurred, retrying in ${waitTime}ms... (${maxRetries} attempts left)`, error);
    }
    
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return withRetry(fn, maxRetries - 1, Math.min(delay * 2, 30000)); // Cap max delay at 30s
  }
};

/**
 * Generate a response using Gemini AI
 * @param userMessage The user's message
 * @returns A promise that resolves to the AI's response
 */
interface GeminiResponse {
  text: () => string;
  promptFeedback?: {
    blockReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  };
}

export const generateResponse = async (
  userMessage: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error('API key not configured. Please check your environment variables.');
  }

  // Basic input validation
  if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
    throw new Error('Please provide a valid message.');
  }

  return withRetry(async () => {
    try {
      // Use Gemini 2.0 Flash model with optimized configuration
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-latest',
        generationConfig: {
          maxOutputTokens: 1024, // Increased for more detailed responses
          temperature: 0.4,      // Lower temperature for more focused responses
          topK: 32,             // Slightly lower for efficiency
          topP: 0.8,            // Slightly lower for more focused responses
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      });

      // Combine system prompt with user message
      const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`;
      
      // Generate content
      const result = await model.generateContent(prompt);
      const response = result.response as unknown as GeminiResponse;
      
      // Check for blocked content or safety issues
      if (response.promptFeedback?.blockReason) {
        console.warn('Content was blocked:', response.promptFeedback);
        throw new Error('I\'m sorry, but I can\'t respond to that request.');
      }
      
      const text = response.text();
      
      if (!text) {
        throw new Error('Received an empty response from the AI model.');
      }

      return text.trim();
    } catch (error: unknown) {
      console.error('Error in generateResponse:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('quota')) {
          throw new Error('I\'ve reached my usage limit. Please try again later or contact support.');
        }
        
        if (errorMessage.includes('api key') || errorMessage.includes('authentication')) {
          throw new Error('There was an authentication error. Please check your API key.');
        }
        
        if (errorMessage.includes('content') && errorMessage.includes('blocked')) {
          throw new Error('I\'m sorry, but I can\'t respond to that request.');
        }
      }
      
      // Generic error message for other cases
      throw new Error('Sorry, I encountered an unexpected error. Please try again in a moment.');
    }
  });
};

