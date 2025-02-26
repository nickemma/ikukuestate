import express from "express";
import {
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertiesByRegion,
  getAllProperties,
  getSimilarProperties,
  getAllPropertyHouse,
  getAllPropertyLand,
} from "../controllers/property.controller";
import { upload } from "../middleware/multer";
import { protect, admin } from "../middleware/auth.middleware";

const router = express.Router();

// @route POST /api/admin/properties
router.post(
  "/properties",
  protect,
  admin,
  upload.array("images", 5),
  createProperty
);
// @route GET /api/v1/admin/properties
router.get("/properties", getAllProperties);

// @route GET /api/v1/admin/properties/houses
router.get("/properties/houses", getAllPropertyHouse);

// @route GET /api/v1/admin/properties/lands
router.get("/properties/lands", getAllPropertyLand);

// @route GET /api/v1/admin/properties
router.get("/properties/region/:regionId", getPropertiesByRegion);

// @route GET /api/admin/properties/:id
router.get("/properties/similar", getSimilarProperties);

// @route GET /api/admin/properties/:id
router.get("/properties/:id", getPropertyById);

// @route PUT /api/admin/properties/:id
router.put(
  "/properties/:id",
  protect,
  admin,
  upload.array("images", 5),
  updateProperty
);

// @route DELETE /api/admin/properties/:id
router.delete("/properties/:id", protect, admin, deleteProperty);

export default router;
