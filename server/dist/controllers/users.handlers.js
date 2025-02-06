"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewFavorites = exports.removeFavorite = exports.addFavorite = void 0;
const http_config_1 = require("../config/http.config");
const property_model_1 = __importDefault(require("../database/models/property.model"));
const user_model_1 = __importDefault(require("../database/models/user.model"));
const asyncHandler_1 = require("../middleware/asyncHandler");
/*
 * @route   POST api/v1/favorites
 * @desc    Add a property to favorites
 * @access  Private
 */
exports.addFavorite = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { propertyId } = req.body;
    const userId = req.user?.id;
    const property = await property_model_1.default.findById(propertyId);
    if (!property) {
        return res
            .status(http_config_1.HTTPSTATUS.NOT_FOUND)
            .json({ message: "Property not found" });
    }
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        return res
            .status(http_config_1.HTTPSTATUS.NOT_FOUND)
            .json({ message: "User not found" });
    }
    if (user.favorites.includes(propertyId)) {
        return res
            .status(http_config_1.HTTPSTATUS.BAD_REQUEST)
            .json({ message: "Property is already in favorites" });
    }
    user.favorites.push(propertyId);
    await user.save();
    res.status(http_config_1.HTTPSTATUS.OK).json({ message: "Property added to favorites" });
});
/*
 * @route   DELETE api/v1/favorites/:id
 * @desc    Remove a property from favorites
 * @access  Private
 */
exports.removeFavorite = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id: propertyId } = req.params;
    const userId = req.user?.id;
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        return res
            .status(http_config_1.HTTPSTATUS.NOT_FOUND)
            .json({ message: "User not found" });
    }
    const favoriteIndex = user.favorites.findIndex((favorite) => favorite.toString() === propertyId);
    if (favoriteIndex === -1) {
        return res
            .status(http_config_1.HTTPSTATUS.NOT_FOUND)
            .json({ message: "Property not found in favorites" });
    }
    // Remove the property from favorites
    user.favorites.splice(favoriteIndex, 1);
    await user.save();
    res
        .status(http_config_1.HTTPSTATUS.OK)
        .json({ message: "Property removed from favorites" });
});
/*
 * @route   GET api/v1/favorites
 * @desc    Get all properties in favorites
 * @access  Private
 */
exports.viewFavorites = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const user = await user_model_1.default.findById(userId).populate("favorites");
    if (!user) {
        return res
            .status(http_config_1.HTTPSTATUS.NOT_FOUND)
            .json({ message: "User not found" });
    }
    res.status(http_config_1.HTTPSTATUS.OK).json({ favorites: user.favorites });
});
