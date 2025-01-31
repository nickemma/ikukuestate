import { asyncHandler } from "../middleware/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/app.config";
import Region from "../database/models/region.model";
import { console } from "inspector";

/*
 * @route   POST api/admin/regions
 * @desc    Create a new region
 * @access  Private
 */

export const createRegion = asyncHandler(async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  if (!req.file) {
    // Change to check req.file
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "At least one image is required" });
  }

  // Upload image to Cloudinary
  const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
    folder: "ikukuestate",
    transformation: [
      { quality: "auto", fetch_format: "auto" },
      { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
    ],
  });

  // Create a new region
  const region = new Region({
    city,
    image: uploadedImage.secure_url,
  });

  await region.save();

  res.status(HTTPSTATUS.CREATED).json({
    message: "Region created successfully",
    data: region,
  });
});

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
  const { city, image } = req.body;

  // Check if all required fields are provided
  if (!city || !image) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  const region = await Region.findById(req.params.id);

  if (!region) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Region not found" });
  }

  // Upload new images if provided
  let imagesUrl = region.image; // Keep existing images by default

  // Upload image to Cloudinary
  const uploadedImage = await cloudinary.uploader.upload(image, {
    folder: "ikukuestate",
    transformation: [
      { quality: "auto", fetch_format: "auto" },
      { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
    ],
  });

  imagesUrl = uploadedImage.secure_url;

  region.city = city;
  region.image = imagesUrl;

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
