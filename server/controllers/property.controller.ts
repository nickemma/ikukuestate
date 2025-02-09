import fs from "fs";
import { asyncHandler } from "../middleware/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import { v2 as cloudinary } from "cloudinary";
import { Resend } from "resend";
import { newListingTemplate } from "../mailer/template";
import { config } from "../config/app.config";
import User from "../database/models/user.model";
import Property from "../database/models/property.model";
import Region from "../database/models/region.model";
import mongoose from "mongoose";

const resend = new Resend(config.RESEND_API_KEY);

/*
 * @route   POST api/admin/properties
 * @desc    Create a new property
 * @access  Private
 */

export const createProperty = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    location,
    propertyType,
    price,
    propertyDetails,
    beds,
    baths,
    sqft,
    region,
    furnished,
    features,
  } = req.body;

  try {
    // Validation
    if (
      !name ||
      !description ||
      !location ||
      !propertyType ||
      !price ||
      !propertyDetails ||
      !beds ||
      !baths ||
      !sqft ||
      !region ||
      furnished === undefined ||
      !features
    ) {
      // Clean up any uploaded files
      if (req.files) {
        (req.files as Express.Multer.File[]).forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    // Validate region existence
    const existingRegion = await Region.findById(region);
    if (!existingRegion) {
      // Clean up files if region is invalid
      if (req.files) {
        (req.files as Express.Multer.File[]).forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ message: "Invalid region" });
    }

    // Handle file uploads
    if (!req.files?.length) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ message: "At least one image is required" });
    }

    const files = req.files as Express.Multer.File[];

    // Upload images to Cloudinary
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "ikukuestate",
        transformation: [
          { quality: "auto", fetch_format: "auto" },
          { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
        ],
      })
    );

    const uploadedImages = await Promise.all(uploadPromises);

    const imageUrls = uploadedImages.map((img) => img.secure_url);

    // Clean up temp files
    files.forEach((file) => fs.unlinkSync(file.path));

    let featuresArray = [];
    try {
      featuresArray = JSON.parse(features);
    } catch {
      featuresArray = features.split(",").map((f: string) => f.trim());
    }

    // Create new property
    const property = new Property({
      name,
      description,
      location,
      propertyType,
      price: Number(price),
      propertyDetails,
      beds: Number(beds),
      baths: Number(baths),
      sqft: Number(sqft),
      furnished: Boolean(furnished),
      features: featuresArray,
      region,
      images: imageUrls,
    });

    const savedProperty = await property.save();

    // Send email to all users about the new property
    const verifiedUsers = await User.find({ isVerified: true }).select("email");
    const notificationUrl = `https://ikukuestate.vercel.app/properties/${savedProperty._id}`;

    // Use Promise.all for parallel execution
    await Promise.all(
      verifiedUsers.map(async (user) => {
        await resend.emails.send({
          from: "Admin <onboarding@resend.dev>",
          to: user.email,
          subject: "New Property Listing Available",
          html: newListingTemplate(
            notificationUrl,
            JSON.stringify(savedProperty)
          ).html,
        });
      })
    );

    res.status(HTTPSTATUS.CREATED).json({
      message: "Property created successfully",
      property: savedProperty,
    });
  } catch (error) {
    // Clean up any remaining files
    if (req.files) {
      (req.files as Express.Multer.File[]).forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    console.error("Error creating property:", error);
    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: "Error creating property",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

/*
 * @route   PUT api/admin/properties/:id
 * @desc    Update a property
 * @access  Private
 */

export const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    location,
    propertyType,
    price,
    propertyDetails,
    beds,
    baths,
    sqft,
    region,
    furnished,
    features,
  } = req.body;

  try {
    // Validate required fields
    if (
      !name ||
      !description ||
      !location ||
      !propertyType ||
      !price ||
      !propertyDetails ||
      !beds ||
      !baths ||
      !sqft ||
      !region ||
      furnished === undefined ||
      !features
    ) {
      // Clean up uploaded files if validation fails
      if (req.files) {
        (req.files as Express.Multer.File[]).forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    // Check property existence
    const property = await Property.findById(id);
    if (!property) {
      // Clean up files if property not found
      if (req.files) {
        (req.files as Express.Multer.File[]).forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
      return res
        .status(HTTPSTATUS.NOT_FOUND)
        .json({ message: "Property not found" });
    }

    // Validate region exists
    const existingRegion = await Region.findById(region);
    if (!existingRegion) {
      if (req.files) {
        (req.files as Express.Multer.File[]).forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ message: "Invalid region" });
    }

    let newImageUrls = [...property.images];
    const files = req.files as Express.Multer.File[];

    // Handle image uploads
    if (files?.length) {
      try {
        // Upload new images
        const uploadPromises = files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: "ikukuestate",
            transformation: [
              { quality: "auto", fetch_format: "auto" },
              { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
            ],
          })
        );

        const uploadedImages = await Promise.all(uploadPromises);
        newImageUrls = [
          ...property.images,
          ...uploadedImages.map((img) => img.secure_url),
        ];

        // Cleanup temp files after successful upload
        files.forEach((file) => fs.unlinkSync(file.path));
      } catch (error) {
        // Cleanup files on upload failure
        files.forEach((file) => fs.unlinkSync(file.path));
        console.error("Image upload error:", error);
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
          message: "Image upload failed",
          error: process.env.NODE_ENV === "development" ? error : undefined,
        });
      }
    }

    // Update property data
    const updatedData = {
      name,
      description,
      location,
      propertyType,
      price: Number(price),
      propertyDetails,
      beds: Number(beds),
      baths: Number(baths),
      sqft: Number(sqft),
      furnished: Boolean(furnished),
      features: Array.isArray(features) ? features : JSON.parse(features),
      region,
      images: newImageUrls,
    };

    const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).populate("region");

    res.status(HTTPSTATUS.OK).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    // Cleanup any remaining files
    if (req.files) {
      (req.files as Express.Multer.File[]).forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    console.error("Update property error:", error);
    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: "Error updating property",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

/*
 * @route   DELETE api/admin/properties/:id
 * @desc    Delete a property
 * @access  Private
 */

export const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const property = await Property.findByIdAndDelete(id).populate("region");

  if (!property) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Property not found" });
  }

  await Promise.all(
    property.images.map((image) => cloudinary.uploader.destroy(image))
  );

  res.status(HTTPSTATUS.OK).json({ message: "Property deleted successfully" });
});

/*
 * @route   GET api/admin/properties
 * @desc    Get all properties
 * @access  Public
 */

export const getAllProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find().populate("region"); // Populate region if you want to get full region details

  res.status(HTTPSTATUS.OK).json(properties);
});

/*
 * @route   GET api/admin/properties/:id
 * @desc    Get a property by ID
 * @access  Public
 */

export const getPropertyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const property = await Property.findById(id).populate("region");

  if (!property) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Property not found" });
  }

  res.status(HTTPSTATUS.OK).json(property);
});

/*
 * @route   GET api/admin/properties/region/:regionId
 * @desc    Get all properties in a region
 * @access  Public
 */

export const getPropertiesByRegion = asyncHandler(async (req, res) => {
  const { regionId } = req.params;

  const properties = await Property.find({ region: regionId }).populate(
    "region"
  );

  res.status(HTTPSTATUS.OK).json(properties);
});

/*
 * @route   GET api/admin/properties/search
 * @desc    Get similar properties
 * @access  Public
 */

export const getSimilarProperties = asyncHandler(async (req, res) => {
  const { region, propertyType } = req.query;

  try {
    const properties = await Property.find({
      $or: [
        { region: new mongoose.Types.ObjectId(region as string) },
        { propertyType },
      ],
    }).limit(6);

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch similar properties" });
  }
});
