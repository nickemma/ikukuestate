import { Request } from "express";
import cloudinary from "cloudinary";
import { config } from "../config/app.config";
import multer from "multer";
import fs from "fs";

// Create temporary directory if it doesn't exist
const tmpDir = "/tmp/uploads";
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Configure multer to use /tmp directory for serverless environment
cloudinary.v2.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, tmpDir); // Use Vercel's writable /tmp directory
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
