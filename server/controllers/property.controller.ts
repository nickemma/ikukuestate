import { asyncHandler } from "../middleware/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import Property from "../database/models/property.model";
import { v2 as cloudinary } from "cloudinary";
import { Resend } from "resend";
import { newListingTemplate } from "../mailer/template";
import { config } from "../config/app.config";
import User from "../database/models/user.model";

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
    // city,
    // type,
    // price,
    // propertyDetails,
    // beds,
    // baths,
    // sqft,
    furnished,
  } = req.body;

  // Check if all required fields are provided
  if (
    !name ||
    !description ||
    // !city ||
    // !type ||
    // !price ||
    // !propertyDetails ||
    // !beds ||
    // !baths ||
    // !sqft ||
    furnished === undefined
  ) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "All fields are required" });
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
    // city,
    // type,
    // price,
    // propertyDetails,
    // beds,
    // baths,
    // sqft,
    furnished,
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
    // city,
    // type,
    // price,
    // propertyDetails,
    // beds,
    // baths,
    // sqft,
    furnished,
  } = req.body;

  // Check if the property exists
  const property = await Property.findById(id);
  if (!property) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Property not found" });
  }

  // Check if all required fields are provided (except images)
  if (
    !name ||
    !description ||
    // !city ||
    // !type ||
    // !price ||
    // !propertyDetails ||
    // !beds ||
    // !baths ||
    // !sqft ||
    furnished === undefined
  ) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  // Upload new images if provided
  let imageUrls = property.images; // Keep existing images by default

  if (req.files && req.files.length) {
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
    imageUrls = uploadedImages.map((result) => result.secure_url); // Update image URLs
  }

  // Update property details
  property.name = name;
  property.description = description;
  // property.city = city; // Uncomment and set fields as necessary
  // property.type = type;
  // property.price = price;
  // property.propertyDetails = propertyDetails;
  // property.beds = beds;
  // property.baths = baths;
  // property.sqft = sqft;
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

  const property = await Property.findByIdAndDelete(id);

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
  const properties = await Property.find();

  res.status(HTTPSTATUS.OK).json(properties);
});

/*
 * @route   GET api/admin/properties/:id
 * @desc    Get a property by ID
 * @access  Public
 */

export const getPropertyDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const property = await Property.findById(id);

  if (!property) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Property not found" });
  }

  res.status(HTTPSTATUS.OK).json(property);
});
