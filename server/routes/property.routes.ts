import express from "express";
import {
  createProperty,
  getPropertyDetails,
  updateProperty,
  deleteProperty,
  getAllProperties,
} from "../controllers/property.controller";
import { upload } from "../middleware/multer";
import { protect, admin } from "../middleware/auth.middleware";

const router = express.Router();

// @route POST /api/admin/properties
router.post(
  "/properties",
  upload.array("images", 5),
  protect,
  admin,
  createProperty
);
// @route GET /api/admin/properties
router.get("/properties", getAllProperties);
// @route GET /api/admin/properties/:id
router.get("/properties/:id", getPropertyDetails);
// @route PUT /api/admin/properties/:id
router.put("/properties/:id", updateProperty);
// @route DELETE /api/admin/properties/:id
router.delete("/properties/:id", deleteProperty);

export default router;
