import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import GenerateGeminiResponse from './AIController.js';
import upload from "./config/multer.js";
import cloudinary from "./config/cloudinary.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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
})
app.post("/upload-image", upload.single("image"), async (req, res) => {
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
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
