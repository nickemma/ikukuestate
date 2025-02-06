"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const users_handlers_1 = require("../controllers/users.handlers");
const router = express_1.default.Router();
router.post("/favorites", auth_middleware_1.protect, users_handlers_1.addFavorite); // Add property to favorites
router.get("/favorites", auth_middleware_1.protect, users_handlers_1.viewFavorites); // View favorites
router.delete("/favorites/:id", auth_middleware_1.protect, users_handlers_1.removeFavorite); // Remove property from favorites
exports.default = router;
