"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const get_env_1 = require("../util/get.env");
const appConfig = () => ({
    NODE_ENV: (0, get_env_1.getEnv)("NODE_ENV", "development"),
    PORT: (0, get_env_1.getEnv)("PORT", "5000"),
    MONGO_URI: (0, get_env_1.getEnv)("MONGO_URI"),
    RESEND_API_KEY: (0, get_env_1.getEnv)("RESEND_API_KEY"),
    CLOUDINARY_CLOUD_NAME: (0, get_env_1.getEnv)("CLOUDINARY_CLOUD_NAME"),
    CLOUDINARY_API_KEY: (0, get_env_1.getEnv)("CLOUDINARY_API_KEY"),
    CLOUDINARY_API_SECRET: (0, get_env_1.getEnv)("CLOUDINARY_API_SECRET"),
    JWT: {
        JWT_SECRET: (0, get_env_1.getEnv)("JWT_SECRET"),
        JWT_EXPIRES_IN: (0, get_env_1.getEnv)("JWT_EXPIRES_IN", "1h"),
        JWT_REFRESH_TOKEN: (0, get_env_1.getEnv)("JWT_REFRESH_TOKEN", "7d"),
    },
});
exports.config = appConfig();
