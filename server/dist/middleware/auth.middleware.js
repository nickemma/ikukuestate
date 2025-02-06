"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_config_1 = require("../config/http.config");
const app_config_1 = require("../config/app.config");
const asyncHandler_1 = require("./asyncHandler");
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, app_config_1.config.JWT.JWT_SECRET);
            req.user = { id: decoded.id, role: decoded.role };
            next();
        }
        catch (error) {
            console.error("Token verification failed:", error.message);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token provided");
    }
};
exports.protect = protect;
exports.admin = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        res.status(http_config_1.HTTPSTATUS.FORBIDDEN);
        throw new Error("Forbidden: Not an admin");
    }
    next();
});
