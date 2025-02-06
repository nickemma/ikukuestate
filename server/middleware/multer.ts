import cloudinary from "cloudinary";
import { config } from "../config/app.config";
import multer from "multer";
import path from "path";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
  },
});

// Create the multer instance
export const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});
