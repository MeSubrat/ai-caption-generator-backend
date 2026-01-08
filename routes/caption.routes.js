import express from 'express';
import { generateCaption, generateCaptionFromText, uploadImage } from '../controller/caption.controller.js';
import upload from '../config/multer.js';
const router = express.Router();

// router.post('/generate-response', generateCaption);
router.post('/upload-image', upload.single("image"), uploadImage);
router.post('/generate-response',generateCaptionFromText);




export default router;