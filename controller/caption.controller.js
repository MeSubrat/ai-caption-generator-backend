import GenerateGeminiResponse from '../controller/AIController.js';

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


// export default generateCaption;
export { generateCaption, uploadImage };