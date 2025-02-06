"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegion = exports.updateRegion = exports.getRegionById = exports.getAllRegions = exports.createRegion = void 0;
const asyncHandler_1 = require("../middleware/asyncHandler");
const http_config_1 = require("../config/http.config");
const cloudinary_1 = require("cloudinary");
const region_model_1 = __importDefault(require("../database/models/region.model"));
/*
 * @route   POST api/admin/regions
 * @desc    Create a new region
 * @access  Private
 */
exports.createRegion = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { city } = req.body;
    if (!city) {
        return res
            .status(http_config_1.HTTPSTATUS.BAD_REQUEST)
            .json({ message: "All fields are required" });
    }
    if (!req.file) {
        // Change to check req.file
        return res
            .status(http_config_1.HTTPSTATUS.BAD_REQUEST)
            .json({ message: "At least one image is required" });
    }
    // Upload image to Cloudinary
    const uploadedImage = await cloudinary_1.v2.uploader.upload(req.file.path, {
        folder: "ikukuestate",
        transformation: [
            { quality: "auto", fetch_format: "auto" },
            { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
        ],
    });
    // Create a new region
    const region = new region_model_1.default({
        city,
        image: uploadedImage.secure_url,
    });
    await region.save();
    res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Region created successfully",
        data: region,
    });
});
/*
 * @route   GET api/admin/regions
 * @desc    Get all regions
 * @access  Public
 */
exports.getAllRegions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const regions = await region_model_1.default.find();
    res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Regions retrieved successfully",
        data: regions,
    });
});
/*
 * @route   GET api/admin/regions/:id
 * @desc    Get a region by ID
 * @access  Public
 */
exports.getRegionById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const region = await region_model_1.default.findById(req.params.id);
    if (!region) {
        return res
            .status(http_config_1.HTTPSTATUS.NOT_FOUND)
            .json({ message: "Region not found" });
    }
    res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Region retrieved successfully",
        data: region,
    });
});
/*
 * @route   PUT api/admin/regions/:id
 * @desc    Update a region
 * @access  Private
 */
exports.updateRegion = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { city } = req.body;
    // Check if the city field is provided
    if (!city) {
        return res
            .status(http_config_1.HTTPSTATUS.BAD_REQUEST)
            .json({ message: "City is required" });
    }
    const region = await region_model_1.default.findById(req.params.id);
    if (!region) {
        return res
            .status(http_config_1.HTTPSTATUS.NOT_FOUND)
            .json({ message: "Region not found" });
    }
    // Update the city
    region.city = city;
    // Check if a new image is provided
    if (req.file) {
        // Upload the new image to Cloudinary
        const uploadedImage = await cloudinary_1.v2.uploader.upload(req.file.path, {
            folder: "ikukuestate",
            transformation: [
                { quality: "auto", fetch_format: "auto" },
                { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
            ],
        });
        // Delete the old image from Cloudinary (if it exists)
        if (region.image) {
            await cloudinary_1.v2.uploader.destroy(region.image); // Delete the old image
        }
        // Update the region's image URL
        region.image = uploadedImage.secure_url;
    }
    // Save the updated region
    await region.save();
    res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Region updated successfully",
        data: region,
    });
});
/*
 * @route   DELETE api/admin/regions/:id
 * @desc    Delete a region
 * @access  Private
 */
exports.deleteRegion = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const region = await region_model_1.default.findByIdAndDelete(id);
    if (!region) {
        return res
            .status(http_config_1.HTTPSTATUS.NOT_FOUND)
            .json({ message: "Region not found" });
    }
    // Delete image from Cloudinary
    await cloudinary_1.v2.uploader.destroy(region.image);
    res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Region deleted successfully",
    });
});
