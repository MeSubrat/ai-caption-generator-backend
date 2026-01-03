import { GoogleGenAI } from "@google/genai";
import dotenv, { parse } from "dotenv";
import fetchImageAsBase64 from '../config/fetchImageAsBase64.js';
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const GenerateGeminiResponse = async ({
    scenario,
    platform,
    generateHashtags,
    includeEmojis,
    tone,
    captionLength,
    imageUrl
}) => {
    // console.log('generateHashtags: ', generateHashtags, "includeEmojis: ", includeEmojis);
    // Build rules based on toggles
    const emojiInstruction = includeEmojis
        ? "Include 3–5 relevant emojis in the caption."
        : "Do NOT include any emojis.";

    const hashtagInstruction = generateHashtags
        ? "Generate 3–7 relevant hashtags in the 'hashtags' field."
        : "Set the 'hashtags' field to an empty string \"\" ONLY.";

    // const prompt = `
    // TASK: Generate an engaging social media caption following ALL rules.

    // SCENARIO: ${scenario}
    // PLATFORM: ${platform}
    // TONE: ${tone}
    // CAPTION LENGTH: ${captionLength}

    // RULES:
    // 1. ${emojiInstruction}
    // 2. ${hashtagInstruction}
    // 3. Output ONLY valid JSON with exactly two keys: caption, hashtags.
    // `;

    // const prompt = `
    //     TASK: Generate an engaging social media caption following ALL rules.

    //     SCENARIO: ${scenario}
    //     PLATFORM: ${platform}
    //     TONE: ${tone}
    //     CAPTION LENGTH: ${captionLength}

    //     CRITICAL IMAGE VALIDATION RULE:
    //     - First, analyze the image carefully.
    //     - If you cannot see the image clearly, write exactly: "NO IMAGE DATA RECEIVED".

    //     RULES:
    //     1. ${emojiInstruction}
    //     2. ${hashtagInstruction}
    //     3. The caption MUST clearly reflect the contents of the image.
    //     4. Output ONLY valid JSON with exactly three keys:
    //     - caption
    //     - hashtags
    //     - vision_check
    //     `;

    const prompt = `
        TASK:
        Generate a highly engaging, scroll-stopping social media caption.

        INPUTS:
        - SCENARIO: ${scenario || "NOT PROVIDED"}
        - PLATFORM: ${platform}
        - TONE: ${tone}
        - CAPTION LENGTH: ${captionLength}
        - IMAGE: PROVIDED (use it silently as visual context)

        CAPTION LOGIC:
        1. If an image is present, the caption MUST be influenced by what is visible.
        2. If no image is present, generate the caption from the scenario only.
        3. Do NOT describe the image literally — write a natural human caption.
        4. Match the caption style to the platform (e.g., Instagram, LinkedIn, Twitter, etc.).
        5. Respect the requested tone and length.

        EMOJI & HASHTAGS RULES:
        - ${emojiInstruction}
        - ${hashtagInstruction}

        STRICT OUTPUT FORMAT:
        Return ONLY valid JSON in this exact structure:
        {
        "caption": "string",
        "hashtags": "string"
        }

        DO NOT include explanations, markdown, or extra text.
        `;
    // const { base64, mime } = await fetchImageAsBase64(imageUrl);
    let base64, mime, fetchResponse;
    if (imageUrl) {
        fetchResponse = await fetchImageAsBase64(imageUrl);
        base64 = fetchResponse.base64;
        mime = fetchResponse.mime;
    }

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
                    {
                        inlineData: {
                            mimeType: mime,
                            data: base64,
                        }
                    }
                ]
            }],
        });

        // Get raw text
        let raw = response.text ? response.text : response.text();

        // Remove any accidental code fencing
        raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

        // Parse JSON
        const parsed = JSON.parse(raw);
        return parsed;
    } catch (error) {
        console.error("Gemini Error:", error);
        return { caption: "Error generating caption", hashtags: "" };
    }
};

export default GenerateGeminiResponse;