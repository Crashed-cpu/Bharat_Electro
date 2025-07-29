# E-commerce Store with AI Chatbot

This is an e-commerce application with an AI-powered chatbot built using React, TypeScript, and Google's Gemini AI.

## Features

- Product browsing and search
- Shopping cart functionality
- User authentication
- Admin dashboard
- AI-powered chatbot with Gemini integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Google Gemini API key
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Using the Chatbot

The AI-powered chatbot is accessible via the chat icon in the bottom-right corner of the application. It can help with:

- Product recommendations
- Technical specifications
- Order status
- General inquiries

## Getting a Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini AI
- React Router

## License

This project is licensed under the MIT License.
