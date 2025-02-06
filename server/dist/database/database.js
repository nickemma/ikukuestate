"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_config_1 = require("../config/app.config");
mongoose_1.default.set("strictQuery", false);
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(app_config_1.config.MONGO_URI);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
exports.default = connectDB;
