"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const property_controller_1 = require("../controllers/property.controller");
const multer_1 = require("../middleware/multer");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// @route POST /api/admin/properties
router.post("/properties", auth_middleware_1.protect, auth_middleware_1.admin, multer_1.upload.array("images", 5), property_controller_1.createProperty);
// @route GET /api/v1/admin/properties
router.get("/properties", property_controller_1.getAllProperties);
// @route GET /api/v1/admin/properties
router.get("/properties/region/:regionId", property_controller_1.getPropertiesByRegion);
// @route GET /api/admin/properties/:id
router.get("/properties/similar", property_controller_1.getSimilarProperties);
// @route GET /api/admin/properties/:id
router.get("/properties/:id", property_controller_1.getPropertyById);
// @route PUT /api/admin/properties/:id
router.put("/properties/:id", auth_middleware_1.protect, auth_middleware_1.admin, multer_1.upload.array("images", 5), property_controller_1.updateProperty);
// @route DELETE /api/admin/properties/:id
router.delete("/properties/:id", auth_middleware_1.protect, auth_middleware_1.admin, property_controller_1.deleteProperty);
exports.default = router;
