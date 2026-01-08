import { GoogleGenAI } from '@google/genai';
import GenerateGeminiResponse from '../controller/AIController.js';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


const generateCaption = async (req, res) => {
    const {
        scenario,
        platform,
        generateHashtags,
        includeEmojis,
        tone,
        captionLength,
        imageUrl
    } = req.body;
    const response = await GenerateGeminiResponse({
        scenario,
        platform,
        generateHashtags,
        includeEmojis,
        tone,
        captionLength,
        imageUrl
    });
    res.status(200).json({ response });
}
const uploadImage = async (req, res) => {
    try {
        const imageUrl = req.file.path; // Cloudinary URL
        if (!req.file) {
            console.log("❌ No file received by multer!");
            return res.status(400).json({ success: false, message: "File missing" });
        }
        res.json({
            success: true,
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({ success: false, error: "Upload failed" });
    }
}


const generateCaptionFromText = async (req, res) => {
    const {
        description,
        platform,
        includeHashtags,
        includeEmojis,
        tone,
        length
    } = req.body;

    const getLengthInstruction = (val) => {
        if (val < 33) return "ULTRA-CONCISE: Maximum 2 sentences. Focus on a single punchy hook.";
        if (val < 66) return "BALANCED: 3-4 sentences. Provide context followed by a clear Call to Action (CTA).";
        return "STORYTELLING: Deep dive. Use a hook, a middle body with value/insight, and a structured CTA.";
    };

    const emojiInstruction = includeEmojis
        ? "EXTENSIVE EMOJIS: Use 3–5 high-quality, relevant emojis to add personality."
        : "NO EMOJIS: Do not use any icons or emojis under any circumstances.";

    // Ensure variable names match your state (includeHashtags)
    const hashtagInstruction = includeHashtags
        ? "HASHTAGS: Provide 5-7 trending and niche-relevant hashtags."
        : "NO HASHTAGS: Return an empty string for the hashtags field.";

    const prompt = `
        ### ROLE
        You are an expert Social Media Strategist and Copywriter specialized in high-conversion content for ${platform}.
        
        ### CONTEXT
        - SCENARIO/TOPIC: ${description || "General lifestyle"}
        - TARGET PLATFORM: ${platform}
        - DESIRED TONE: ${tone}
        - LENGTH CONSTRAINT: ${getLengthInstruction(length)}
        
        ### TASK
        Generate a scroll-stopping caption based on the SCENARIO. 
        
        ### PLATFORM-SPECIFIC GUIDELINES
        - If platform is Twitter: Strictly adhere to character limits.
        - If platform is LinkedIn: Use professional spacing and high-value hooks.
        - If platform is Instagram: Focus on aesthetic language and engagement.
        
        ### STYLE RULES
        1. ${emojiInstruction}
        2. ${hashtagInstruction}
        3. LANGUAGE: English.
        4. FORMATTING: Use line breaks for readability.
        
        ### OUTPUT SCHEMA (JSON ONLY)
        Return exactly this JSON structure. No markdown, no "json" backticks, no preamble.
        {
          "caption": "The generated text here",
          "hashtags": "#tag1 #tag2"
        }
        `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            systemInstruction: {
                parts: [
                    {
                        text: `
                            You are a professional social media copywriter.

                            CORE RULES:
                            - Follow emoji and hashtag rules exactly.
                            - Match platform style perfectly.
                            - Respect tone and caption length.
                            - If image data is present, use it as silent context.
                            - Never mention the image directly unless it is natural to do so.
                            - Never hallucinate unseen details.

                            OUTPUT RULE:
                            Return ONLY raw JSON with these exact keys:
                            - caption
                            - hashtags

                            If output is not valid JSON, the response is considered a failure.
                            `
                    },
                ],
            },
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.8,
                responseSchema: {
                    type: "object",
                    properties: {
                        caption: { type: "string" },
                        hashtags: { type: "string" },
                    },
                    required: ["caption", "hashtags"],
                },
            },
            contents: [{
                role: "user",
                parts: [
                    { text: prompt },
                    // {
                    //     inlineData: {
                    //         mimeType: mime,
                    //         data: base64,
                    //     }
                    // }
                ]
            }],
        });

        // Get raw text
        let raw = response.text ? response.text : response.text();

        // Remove any accidental code fencing
        raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

        // Parse JSON
        const parsed = JSON.parse(raw);
        return res.status(200).json({ result: parsed, message: 'Caption Generated Successfully.' });
    } catch (error) {
        console.log('Error: ', error);
    }
}


// export default generateCaption;
export { generateCaption, uploadImage,generateCaptionFromText };