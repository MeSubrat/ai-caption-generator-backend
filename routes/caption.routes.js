import express from 'express';
import { generateCaption, uploadImage } from '../controller/caption.controller.js';
import upload from '../config/multer.js';
const router = express.Router();

router.post('/generate-response', generateCaption);
router.post('/upload-image', upload.single("image"), uploadImage);




export default router;