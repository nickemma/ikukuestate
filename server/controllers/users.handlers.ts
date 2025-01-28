import { HTTPSTATUS } from "../config/http.config";
import propertyModel from "../database/models/property.model";
import User from "../database/models/user.model";
import { asyncHandler } from "../middleware/asyncHandler";
import { Resend } from "resend";
import { config } from "../config/app.config";

const resend = new Resend(config.RESEND_API_KEY);

/*
 * @route   POST api/v1/favorites
 * @desc    Add a property to favorites
 * @access  Private
 */

export const addFavorite = asyncHandler(async (req, res) => {
  const { propertyId } = req.body;
  const userId = (req as any).user?.id;

  console.log(userId, "userId");
  console.log(propertyId, "propertyId");

  const property = await propertyModel.findById(propertyId);

  if (!property) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Property not found" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "User not found" });
  }

  if (user.favorites.includes(propertyId)) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "Property is already in favorites" });
  }

  user.favorites.push(propertyId);
  await user.save();

  res.status(HTTPSTATUS.OK).json({ message: "Property added to favorites" });
});

/*
 * @route   DELETE api/v1/favorites/:id
 * @desc    Remove a property from favorites
 * @access  Private
 */

export const removeFavorite = asyncHandler(async (req, res) => {
  const { id: propertyId } = req.params;
  const userId = (req as any).user?.id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "User not found" });
  }

  const favoriteIndex = user.favorites.findIndex(
    (favorite) => favorite.toString() === propertyId
  );

  if (favoriteIndex === -1) {
    return res
      .status(HTTPSTATUS.NOT_FOUND)
      .json({ message: "Property not found in favorites" });
  }

  // Remove the property from favorites
  user.favorites.splice(favoriteIndex, 1);
  await user.save();

  res
    .status(HTTPSTATUS.OK)
    .json({ message: "Property removed from favorites" });
});

/*
 * @route   GET api/v1/favorites
 * @desc    Get all properties in favorites
 * @access  Private
 */

export const viewFavorites = asyncHandler(async (req, res) => {
  const userId = (req as any).user?.id;

  const user = await User.findById(userId).populate("favorites");

  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "User not found" });
  }

  res.status(HTTPSTATUS.OK).json({ favorites: user.favorites });
});
