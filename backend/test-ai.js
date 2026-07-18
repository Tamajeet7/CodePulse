"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genai_1 = require("@google/genai");
const env_1 = require("./src/config/env");
async function test() {
    console.log("Testing with GEMINI_API_KEY:", env_1.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
    const ai = new genai_1.GoogleGenAI({ apiKey: env_1.env.GEMINI_API_KEY });
    try {
        const res = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: "Hello, this is a test. Please respond with 'OK'.",
        });
        console.log("SUCCESS:", res.text);
    }
    catch (err) {
        console.error("FAIL:", err.message);
    }
}
test();
//# sourceMappingURL=test-ai.js.map