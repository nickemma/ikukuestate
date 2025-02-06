"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const app_config_1 = require("../config/app.config");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configure Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: app_config_1.config.CLOUDINARY_CLOUD_NAME,
    api_key: app_config_1.config.CLOUDINARY_API_KEY,
    api_secret: app_config_1.config.CLOUDINARY_API_SECRET,
});
// Define storage for multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
    },
});
// Create the multer instance
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 },
});
