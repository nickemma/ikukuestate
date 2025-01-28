import express from "express";

import { upload } from "../middleware/multer";
import { protect, admin } from "../middleware/auth.middleware";
import {
  createRegion,
  deleteRegion,
  getAllRegions,
  getRegionById,
  updateRegion,
} from "../controllers/region.controller";

const router = express.Router();

// @route POST /api/admin/properties
router.post("/regions", protect, admin, upload.single("image"), createRegion);
router.get("/regions", getAllRegions);
router.get("/regions/:id", getRegionById);
router.put(
  "/regions/:id",
  protect,
  admin,
  upload.single("image"),
  updateRegion
);
router.delete("/regions/:id", protect, admin, deleteRegion);

export default router;
