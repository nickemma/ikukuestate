import { getEnv } from "../util/get.env";

const appConfig = () => ({
    NODE_ENV: getEnv("NODE_ENV", "development"),
    PORT: getEnv("PORT", "5000"),
    APP_ORIGIN: getEnv("APP_ORIGIN", "localhost"),
    MONGO_URI: getEnv("MONGO_URI"),
    JWT: {
        JWT_SECRET: getEnv("JWT_SECRET"),
        JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "1h"),
        JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
        JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "30d"),
    }
})

export const config = appConfig();