"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSimilarProperties = exports.getPropertiesByRegion = exports.getPropertyById = exports.getAllProperties = exports.deleteProperty = exports.updateProperty = exports.createProperty = void 0;
const asyncHandler_1 = require("../middleware/asyncHandler");
const http_config_1 = require("../config/http.config");
const cloudinary_1 = require("cloudinary");
const resend_1 = require("resend");
const template_1 = require("../mailer/template");
const app_config_1 = require("../config/app.config");
const user_model_1 = __importDefault(require("../database/models/user.model"));
const property_model_1 = __importDefault(require("../database/models/property.model"));
const region_model_1 = __importDefault(require("../database/models/region.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const resend = new resend_1.Resend(app_config_1.config.RESEND_API_KEY);
/*
 * @route   POST api/admin/properties
 * @desc    Create a new property
 * @access  Private
 */
exports.createProperty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, description, location, propertyType, price, propertyDetails, beds, baths, sqft, region, furnished, features, } = req.body;
    // Check if all required fields are provided
    if (!name ||
        !description ||
        !location ||
        !propertyType ||
        !price ||
        !propertyDetails ||
        !beds ||
        !baths ||
        !sqft ||
        !features ||
        !region ||
        furnished === undefined) {
        return res
            .status(http_config_1.HTTPSTATUS.BAD_REQUEST)
            .json({ message: "All fields are required" });
    }
    // Validate region existence
    const existingRegion = await region_model_1.default.findById(region);
    if (!existingRegion) {
        return res
            .status(http_config_1.HTTPSTATUS.BAD_REQUEST)
            .json({ message: "Invalid region" });
    }
    if (!req.files || !req.files.length) {
        return res
            .status(http_config_1.HTTPSTATUS.BAD_REQUEST)
            .json({ message: "At least one image is required" });
    }
    const files = req.files;
    // Upload images to Cloudinary
    const uploadPromises = files.map((file) => cloudinary_1.v2.uploader.upload(file.path, {
        folder: "ikukuestate",
        transformation: [
            { quality: "auto", fetch_format: "auto" },
            { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
        ],
    }));
    const uploadedImages = await Promise.all(uploadPromises);
    const imageUrls = uploadedImages.map((result) => result.secure_url);
    // Create new property
    const property = new property_model_1.default({
        name,
        description,
        location,
        propertyType,
        price,
        propertyDetails,
        beds,
        baths,
        sqft,
        furnished,
        features,
        region,
        images: imageUrls,
    });
    const savedProperty = await property.save();
    // Send email to all users about the new property
    const verifiedUsers = await user_model_1.default.find({ isVerified: true });
    const notificationUrl = `https://ikukuestate.vercel.app/properties/${savedProperty._id}`;
    for (const user of verifiedUsers) {
        await resend.emails.send({
            from: "Admin <onboarding@resend.dev>",
            to: [user.email],
            subject: "New Property Listing Available",
            html: (0, template_1.newListingTemplate)(notificationUrl, JSON.stringify(savedProperty))
                .html,
        });
    }
    res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Property created successfully",
        property: savedProperty,
    });
});
/*
 * @route   PUT api/admin/properties/:id
 * @desc    Update a property
 * @access  Private
 */
exports.updateProperty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, description, location, propertyType, price, propertyDetails, beds, baths, sqft, region, furnished, features, } = req.body;
    // Check if the property exists
    const property = await property_model_1.default.findById(id).populate("region");
    if (!property) {
        return res
            .status(http_config_1.HTTPSTATUS.NOT_FOUND)
            .json({ message: "Property not found" });
    }
    // Check if all required fields are provided (except images)
    if (!name ||
        !description ||
        !location ||
        !propertyType ||
        !price ||
        !propertyDetails ||
        !beds ||
        !baths ||
        !sqft ||
        !features ||
        !region ||
        furnished === undefined) {
        return res
            .status(http_config_1.HTTPSTATUS.BAD_REQUEST)
            .json({ message: "All fields are required" });
    }
    // Upload new images if provided
    let imageUrls = [...property.images]; // Keep existing images by default
    if (req.files && req.files.length) {
        const files = req.files;
        try {
            // Upload images to Cloudinary
            const uploadPromises = files.map((file) => cloudinary_1.v2.uploader.upload(file.path, {
                folder: "ikukuestate",
                transformation: [
                    { quality: "auto", fetch_format: "auto" },
                    { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
                ],
            }));
            const uploadedImages = await Promise.all(uploadPromises);
            const newImageUrls = uploadedImages.map((result) => result.secure_url);
            imageUrls = [...imageUrls, ...newImageUrls]; // Merge new images with existing ones
        }
        catch (error) {
            return res
                .status(http_config_1.HTTPSTATUS.BAD_REQUEST)
                .json({ message: "Image upload failed", error: error.message });
        }
    }
    // Update property details
    property.name = name;
    property.description = description;
    property.location = location;
    property.propertyType = propertyType;
    property.price = price;
    property.propertyDetails = propertyDetails;
    property.beds = beds;
    property.baths = baths;
    property.sqft = sqft;
    property.features = features;
    property.furnished = furnished;
    property.images = imageUrls; // Update images
    const updatedProperty = await property.save();
    res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Property updated successfully",
        property: updatedProperty,
    });
});
/*
 * @route   DELETE api/admin/properties/:id
 * @desc    Delete a property
 * @access  Private
 */
exports.deleteProperty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const property = await property_model_1.default.findByIdAndDelete(id).populate("region");
    if (!property) {
        return res
            .status(http_config_1.HTTPSTATUS.NOT_FOUND)
            .json({ message: "Property not found" });
    }
    await Promise.all(property.images.map((image) => cloudinary_1.v2.uploader.destroy(image)));
    res.status(http_config_1.HTTPSTATUS.OK).json({ message: "Property deleted successfully" });
});
/*
 * @route   GET api/admin/properties
 * @desc    Get all properties
 * @access  Public
 */
exports.getAllProperties = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const properties = await property_model_1.default.find().populate("region"); // Populate region if you want to get full region details
    res.status(http_config_1.HTTPSTATUS.OK).json(properties);
});
/*
 * @route   GET api/admin/properties/:id
 * @desc    Get a property by ID
 * @access  Public
 */
exports.getPropertyById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const property = await property_model_1.default.findById(id).populate("region");
    if (!property) {
        return res
            .status(http_config_1.HTTPSTATUS.NOT_FOUND)
            .json({ message: "Property not found" });
    }
    res.status(http_config_1.HTTPSTATUS.OK).json(property);
});
/*
 * @route   GET api/admin/properties/region/:regionId
 * @desc    Get all properties in a region
 * @access  Public
 */
exports.getPropertiesByRegion = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { regionId } = req.params;
    const properties = await property_model_1.default.find({ region: regionId }).populate("region");
    res.status(http_config_1.HTTPSTATUS.OK).json(properties);
});
/*
 * @route   GET api/admin/properties/search
 * @desc    Get similar properties
 * @access  Public
 */
exports.getSimilarProperties = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { region, propertyType } = req.query;
    try {
        const properties = await property_model_1.default.find({
            $or: [
                { region: new mongoose_1.default.Types.ObjectId(region) },
                { propertyType },
            ],
        }).limit(6);
        res.status(200).json(properties);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch similar properties" });
    }
});
