import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params: {
        folder: "caption-generator",    // your folder name in cloudinary
        allowedFormats: ["jpg", "jpeg", "png"],
        resource_type:"image",
    },
});

const upload = multer({ storage });

export default upload;
