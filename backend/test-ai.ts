import { GoogleGenAI } from '@google/genai';
import { env } from './src/config/env';

async function test() {
  console.log("Testing with GEMINI_API_KEY:", env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: "Hello, this is a test. Please respond with 'OK'.",
    });
    console.log("SUCCESS:", res.text);
  } catch (err: any) {
    console.error("FAIL:", err.message);
  }
}

test();
