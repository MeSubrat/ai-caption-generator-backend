import express, { urlencoded } from 'express';
import dotenv from "dotenv";
import cors from 'cors';
// import GenerateGeminiResponse from './controller/AIController.js';
// import upload from "./config/multer.js";
import cloudinary from "./config/cloudinary.js";
import connectDb from './config/dbConfig.js';
import captionRoutes from './routes/caption.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ai-caption-generator-frontend-smoky.vercel.app/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB Connection.
connectDb();

app.get('/', (req, res) => {
    res.send("Hey it's working!");
})

// app.get("/test-gemini", async (req, res) => {
//     const text = await GenerateGeminiResponse();
//     res.json({ message: text });
// });
app.use(captionRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
