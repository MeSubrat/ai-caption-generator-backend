import { createUserContent, GoogleGenAI } from "@google/genai";
// const GoogleGenAI = require('@google/genai');
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
// console.log('API Key: ', process.env.GEMINI_API_KEY ? "Loaded" : "Not Loaded");
const GenerateGeminiResponse = async ({ scenario, platform, generateHashtags, includeEmojis, tone, captionLength }) => {

    const prompt = `
You MUST return the output in the following JSON format ONLY:

{
  "caption": "CAPTION_TEXT_WITH_OR_WITHOUT_EMOJIS",
  "hashtags": "HASHTAGS_IF_REQUIRED"
}

RULES:
- "caption" MUST include emojis if includeEmojis = ${includeEmojis}.
- "hashtags" MUST contain 3-7 hashtags if generateHashtags = ${generateHashtags}.
- If generateHashtags = false, "hashtags" must be an empty string "".
- Caption MUST follow this tone: ${tone}.
- Caption length must be: ${captionLength}.
- Do NOT add explanations.
- Do NOT wrap values in extra quotes.
- NEVER output anything outside the JSON structure.

CONTEXT:
Scenario: ${scenario}
Platform: ${platform}

Generate the JSON now.
`;


    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                systemInstruction:
                    "You generate clean, short, platform-optimized captions. Always follow emoji and hashtag rules strictly.",
                responseMimeType: "application/json"
            },
        });
        let raw = response.text;

        // Remove markdown formatting (code blocks)
        raw = raw.replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const result = JSON.parse(raw);
        return result;
    } catch (error) {
        console.log('Error: ', error);
        return "Error generating caption."
    }
}
export default GenerateGeminiResponse;