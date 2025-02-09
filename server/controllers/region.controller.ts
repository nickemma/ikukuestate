import { asyncHandler } from "../middleware/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import Region from "../database/models/region.model";
/*
 * @route   POST api/admin/regions
 * @desc    Create a new region
 * @access  Private
 */
export const createRegion = asyncHandler(async (req, res) => {
  const { city } = req.body;

  if (!city || !req.file) {
    // Clean up uploaded file if it exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "All fields are required including an image file",
    });
  }

  try {
    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "ikukuestate",
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
      ],
    });

    // Create and save region
    const region = new Region({
      city,
      image: uploadedImage.secure_url,
    });

    await region.save();

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    res.status(HTTPSTATUS.CREATED).json({
      message: "Region created successfully",
      data: region,
    });
  } catch (error) {
    // Clean up file if upload failed
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error creating region:", error);
    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: "Error creating region",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

// export const createRegion = asyncHandler(async (req, res) => {
//   const { city } = req.body;

//   if (!city) {
//     return res
//       .status(HTTPSTATUS.BAD_REQUEST)
//       .json({ message: "All fields are required" });
//   }

//   if (!req.file) {
//     // Change to check req.file
//     return res
//       .status(HTTPSTATUS.BAD_REQUEST)
//       .json({ message: "At least one image is required" });
//   }

//   // Upload image to Cloudinary
//   const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
//     folder: "ikukuestate",
//     transformation: [
//       { quality: "auto", fetch_format: "auto" },
//       { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
//     ],
//   });

//   // Create a new region
//   const region = new Region({
//     city,
//     image: uploadedImage.secure_url,
//   });

//   await region.save();

//   res.status(HTTPSTATUS.CREATED).json({
//     message: "Region created successfully",
//     data: region,
//   });
// });

/*
 * @route   GET api/admin/regions
 * @desc    Get all regions
 * @access  Public
 */

export const getAllRegions = asyncHandler(async (req, res) => {
  const regions = await Region.find();

  res.status(HTTPSTATUS.OK).json({
    message: "Regions retrieved successfully",
    data: regions,
  });
});

/*
 * @route   GET api/admin/regions/:id
 * @desc    Get a region by ID
 * @access  Public
 */

export const getRegionById = asyncHandler(async (req, res) => {
  const region = await Region.findById(req.params.id);

  if (!region) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Region not found" });
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Region retrieved successfully",
    data: region,
  });
});

/*
 * @route   PUT api/admin/regions/:id
 * @desc    Update a region
 * @access  Private
 */

export const updateRegion = asyncHandler(async (req, res) => {
  const { city } = req.body;

  // Check if the city field is provided
  if (!city) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "City is required" });
  }

  const region = await Region.findById(req.params.id);

  if (!region) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Region not found" });
  }

  // Update the city
  region.city = city;

  // Check if a new image is provided
  if (req.file) {
    // Upload the new image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "ikukuestate",
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
      ],
    });

    // Delete the old image from Cloudinary (if it exists)
    if (region.image) {
      await cloudinary.uploader.destroy(region.image); // Delete the old image
    }

    // Update the region's image URL
    region.image = uploadedImage.secure_url;
  }

  // Save the updated region
  await region.save();

  res.status(HTTPSTATUS.OK).json({
    message: "Region updated successfully",
    data: region,
  });
});
/*
 * @route   DELETE api/admin/regions/:id
 * @desc    Delete a region
 * @access  Private
 */

export const deleteRegion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const region = await Region.findByIdAndDelete(id);

  if (!region) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Region not found" });
  }

  // Delete image from Cloudinary
  await cloudinary.uploader.destroy(region.image);

  res.status(HTTPSTATUS.OK).json({
    message: "Region deleted successfully",
  });
});
