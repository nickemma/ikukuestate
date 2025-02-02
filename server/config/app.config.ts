import { getEnv } from "../util/get.env";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  APP_ORIGIN: getEnv("APP_ORIGIN", "localhost"),
  MONGO_URI: getEnv("MONGO_URI"),
  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),
  JWT: {
    JWT_SECRET: getEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m"),
    JWT_REFRESH_TOKEN: getEnv("JWT_REFRESH_TOKEN", "7d"),
  },
});

export const config = appConfig();
