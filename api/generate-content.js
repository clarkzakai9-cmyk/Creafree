// api/generate-content.js (Node.js/Vercel Serverless Function)

import { GoogleGenAI } from '@google/genai';

// IMPORTANT: Vercel securely injects the GEMINI_API_KEY environment variable here.
// The key must be set in your Vercel Project Settings > Environment Variables.
const apiKey = process.env.GEMINI_API_KEY; 

if (!apiKey) {
    // This error will trigger if you forget to set the GEMINI_API_KEY on Vercel
    throw new Error('GEMINI_API_KEY environment variable not set. Check Vercel settings.');
}

const ai = new GoogleGenAI({ apiKey });

export default async function handler(req, res) {
  // Ensure this function only handles POST requests from your client
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Get the prompt text sent from your client-side editor.html
    const { prompt } = req.body;

    // Call the Gemini API securely on the server
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            { role: "user", parts: [{ text: prompt }] }
        ],
        config: {
            temperature: 0.7,
        }
    });

    // Send the generated text back to the client-side JavaScript
    res.status(200).json({ text: response.text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: 'Failed to generate content from AI.' });
  }
}
