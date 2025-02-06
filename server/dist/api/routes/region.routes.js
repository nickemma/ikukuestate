"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../middleware/multer");
const auth_middleware_1 = require("../middleware/auth.middleware");
const region_controller_1 = require("../controllers/region.controller");
const router = express_1.default.Router();
// @route POST /api/admin/properties
router.post("/regions", auth_middleware_1.protect, auth_middleware_1.admin, multer_1.upload.single("image"), region_controller_1.createRegion);
router.get("/regions", region_controller_1.getAllRegions);
router.get("/regions/:id", region_controller_1.getRegionById);
router.put("/regions/:id", auth_middleware_1.protect, auth_middleware_1.admin, multer_1.upload.single("image"), region_controller_1.updateRegion);
router.delete("/regions/:id", auth_middleware_1.protect, auth_middleware_1.admin, region_controller_1.deleteRegion);
exports.default = router;
