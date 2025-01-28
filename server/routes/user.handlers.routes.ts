import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  addFavorite,
  removeFavorite,
  viewFavorites,
} from "../controllers/users.handlers";

const router = express.Router();

router.post("/favorites", protect, addFavorite); // Add property to favorites

router.get("/favorites", protect, viewFavorites); // View favorites

router.delete("/favorites/:id", protect, removeFavorite); // Remove property from favorites

export default router;
