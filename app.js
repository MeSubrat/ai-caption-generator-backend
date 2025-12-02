import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import GenerateGeminiResponse from './AIController.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hey it's working!");
})

app.get("/test-gemini", async (req, res) => {
    const text = await GenerateGeminiResponse();
    res.json({ message: text });
})
app.post("/generate-response", async (req, res) => {
    const {
        scenario,
        platform,
        generateHashtags,
        includeEmojis,
        tone,
        captionLength
    } = req.body;
    // console.log("Received:", req.body);
    const response = await GenerateGeminiResponse(
        scenario,
        platform,
        generateHashtags,
        includeEmojis,
        tone,
        captionLength
    );
    res.status(200).json({ response });
})


app.listen(3000, () => {
    console.log(`Server is running on PORT 3000`);
})
