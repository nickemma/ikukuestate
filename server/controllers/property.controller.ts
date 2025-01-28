import { asyncHandler } from "../middleware/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import { v2 as cloudinary } from "cloudinary";
import { Resend } from "resend";
import { newListingTemplate } from "../mailer/template";
import { config } from "../config/app.config";
import User from "../database/models/user.model";
import Property from "../database/models/property.model";
import Region from "../database/models/region.model";

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

  // Check if all required fields are provided
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
    !features ||
    !region ||
    furnished === undefined
  ) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  // Validate region existence
  const existingRegion = await Region.findById(region);
  if (!existingRegion) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "Invalid region" });
  }

  if (!req.files || !req.files.length) {
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

  const imageUrls = uploadedImages.map((result) => result.secure_url);

  // Create new property
  const property = new Property({
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
  const verifiedUsers = await User.find({ isVerified: true });
  const notificationUrl = `${config.APP_ORIGIN}/properties/${savedProperty._id}`;

  for (const user of verifiedUsers) {
    await resend.emails.send({
      from: "Admin <onboarding@resend.dev>",
      to: [user.email],
      subject: "New Property Listing Available",
      html: newListingTemplate(notificationUrl, JSON.stringify(savedProperty))
        .html,
    });
  }

  res.status(HTTPSTATUS.CREATED).json({
    message: "Property created successfully",
    property: savedProperty,
  });
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

  // Check if the property exists
  const property = await Property.findById(id).populate("region");
  if (!property) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Property not found" });
  }

  // Check if all required fields are provided (except images)
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
    !features ||
    !region ||
    furnished === undefined
  ) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  // Upload new images if provided
  let imageUrls = [...property.images]; // Keep existing images by default

  if (req.files && req.files.length) {
    const files = req.files as Express.Multer.File[];

    try {
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
      const newImageUrls = uploadedImages.map((result) => result.secure_url);
      imageUrls = [...imageUrls, ...newImageUrls]; // Merge new images with existing ones
    } catch (error: any) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
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

  res.status(HTTPSTATUS.OK).json({
    message: "Property updated successfully",
    property: updatedProperty,
  });
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
