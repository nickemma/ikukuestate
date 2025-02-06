"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_config_1 = require("../config/app.config");
const secretKey = app_config_1.config.JWT.JWT_SECRET;
const accessTokenExpiration = app_config_1.config.JWT.JWT_EXPIRES_IN;
const refreshTokenExpiration = app_config_1.config.JWT.JWT_REFRESH_TOKEN;
const generateTokens = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, // Payload
    secretKey, { expiresIn: accessTokenExpiration } // Options (must be a string)
    );
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, // Payload
    secretKey, { expiresIn: refreshTokenExpiration } // Options (must be a string)
    );
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
