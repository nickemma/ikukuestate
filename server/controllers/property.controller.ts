import fs from "fs";
import { asyncHandler } from "../middleware/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import { v2 as cloudinary } from "cloudinary";
import { Resend } from "resend";
import { newListingTemplate } from "../mailer/template";
import { config } from "../config/app.config";
import User from "../database/models/user.model";
import BaseProperty from "../database/models/property.model";
import Region from "../database/models/region.model";
import mongoose from "mongoose";
import { House } from "../database/models/house.model";
import { Land } from "../database/models/land.model";

const resend = new Resend(config.RESEND_API_KEY);

/*
 * @route   POST api/admin/properties
 * @desc    Create a new property
 * @access  Private
 */

export const createProperty = asyncHandler(async (req, res) => {
  const { propertyType, ...rest } = req.body;

  try {
    // common Validation
    if (!propertyType || !["House", "Land"].includes(propertyType)) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ message: "Invalid property type" });
    }

    // base validation
    if (
      !rest.name ||
      !rest.description ||
      !rest.location ||
      !rest.price ||
      !rest.sqft ||
      !rest.region
    ) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ message: "Missing required base fields" });
    }

    // Type-specific validation
    if (propertyType === "House") {
      if (
        !rest.beds ||
        !rest.baths ||
        !rest.furnished ||
        !rest.propertyDetails ||
        !rest.features
      ) {
        return res
          .status(HTTPSTATUS.BAD_REQUEST)
          .json({ message: "Missing required house fields" });
      }
    }

    // Validate region exists
    const existingRegion = await Region.findById(rest.region);
    if (!existingRegion) {
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

    // Create property based on type
    let newProperty;

    if (propertyType === "House") {
      newProperty = new House({
        ...rest,
        beds: Number(rest.beds),
        baths: Number(rest.baths),
        furnished: rest.furnished === "true",
        images: imageUrls,
      });
    } else {
      newProperty = new Land({
        ...rest,
        images: imageUrls,
      });
    }

    const savedProperty = await newProperty.save();

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
      message: `${propertyType} created successfully`,
      property: savedProperty,
    });
  } catch (error) {
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
  const updates = req.body;

  try {
    const property = await BaseProperty.findById(id);
    // Check property existence
    if (!property) {
      return res
        .status(HTTPSTATUS.NOT_FOUND)
        .json({ message: "Property not found" });
    }

    // Preserve existing region if not provided
    const regionId = updates.region || property.region;

    // Validate region exists
    const existingRegion = await Region.findById(regionId);
    if (!existingRegion) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ message: "Invalid region ID" });
    }

    // Type-specific validation
    if (property.propertyType === "House") {
      if (!updates.beds || !updates.baths || !updates.furnished) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
          message: "Missing required house fields",
        });
      }
    }

    // Handle image updates
    let imageUrls = property.images;
    if (req.files?.length) {
      const uploadPromises = (req.files as Express.Multer.File[]).map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "ikukuestate",
          transformation: [
            { quality: "auto", fetch_format: "auto" },
            { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
          ],
        })
      );

      const uploadedImages = await Promise.all(uploadPromises);
      imageUrls = [
        ...imageUrls,
        ...uploadedImages.map((img) => img.secure_url),
      ];

      // Cleanup temp files
      (req.files as Express.Multer.File[]).forEach((file) =>
        fs.unlinkSync(file.path)
      );
    }

    // Merge updates
    const updatedData = {
      ...updates,
      region: regionId,
      images: imageUrls,
      price: Number(updates.price),
      sqft: Number(updates.sqft),
    };

    const updatedProperty = await BaseProperty.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("region");

    res.status(HTTPSTATUS.OK).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
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

  const property = await BaseProperty.findByIdAndDelete(id);
  if (!property) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Property not found" });
  }
  // Extract public IDs from Cloudinary URLs
  const deletePromises = property.images.map((imageUrl) => {
    const publicId = imageUrl.split("/").pop()?.split(".")[0];
    return publicId ? cloudinary.uploader.destroy(publicId) : Promise.resolve();
  });

  await Promise.allSettled(deletePromises);

  res.status(HTTPSTATUS.OK).json({ message: "Property deleted successfully" });
});

/*
 * @route   GET api/admin/properties
 * @desc    Get all properties
 * @access  Public
 */

export const getAllProperties = asyncHandler(async (req, res) => {
  const allProperties = await BaseProperty.find({});
  res.status(HTTPSTATUS.OK).json(allProperties);
});

/*
 * @route   GET api/admin/properties/:id
 * @desc    Get a property by ID
 * @access  Public
 */

export const getPropertyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const property = await BaseProperty.findById(id).populate("region");

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

  const properties = await BaseProperty.find({ region: regionId }).populate(
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
  const { regionId, propertyType } = req.query;

  try {
    const properties = await BaseProperty.find({
      region: new mongoose.Types.ObjectId(regionId as string),
      propertyType: propertyType,
    })
      .limit(6)
      .populate("region");

    res.status(HTTPSTATUS.OK).json(properties);
  } catch (error) {
    console.error("Similar properties error:", error);
    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching similar properties",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

/*
 * @route   GET api/admin/properties
 * @desc    Get all properties in a house
 * @access  Public
 */

export const getAllPropertyHouse = asyncHandler(async (req, res) => {
  const houses = await House.find({});
  res.status(HTTPSTATUS.OK).json(houses);
});

/*
 * @route   GET api/admin/properties
 * @desc    Get all properties
 * @access  Public
 */

export const getAllPropertyLand = asyncHandler(async (req, res) => {
  const lands = await Land.find({});
  res.status(HTTPSTATUS.OK).json(lands);
});
