"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// files import
const app_config_1 = require("./config/app.config");
const database_1 = __importDefault(require("./database/database"));
const http_config_1 = require("./config/http.config");
const asyncHandler_1 = require("./middleware/asyncHandler");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const property_routes_1 = __importDefault(require("./routes/property.routes"));
const region_routes_1 = __importDefault(require("./routes/region.routes"));
const user_handlers_routes_1 = __importDefault(require("./routes/user.handlers.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
//============= Middlewares
// Make sure this comes FIRST before any routes
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://ikukuestate.vercel.app"],
    credentials: true,
}));
// Handle preflight requests
app.options("*", (0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
//============= test Route for server
app.get("/", (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Hello Ikuku Properties",
    });
}));
//============= Routes
app.use("/api/v1/auth", user_routes_1.default);
app.use("/api/v1", user_handlers_routes_1.default);
app.use("/api/v1/admin", property_routes_1.default);
app.use("/api/v1/admin", region_routes_1.default);
app.use(errorHandler_1.errorHandler);
//============= Server
app.listen(app_config_1.config.PORT, async () => {
    await (0, database_1.default)();
    console.log(`Server running on port http://localhost:${app_config_1.config.PORT}`);
});
