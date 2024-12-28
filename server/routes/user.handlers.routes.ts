import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  addFavorite,
  bookAppointment,
  cancelBooking,
  removeFavorite,
  viewAppointments,
  viewFavorites,
} from "../controllers/users.handlers";

const router = express.Router();

router.post("/favorites", protect, addFavorite); // Add property to favorites
router.post("/appointments", protect, bookAppointment); // Book an appointment

router.get("/favorites", protect, viewFavorites); // View favorites
router.get("/appointments", protect, viewAppointments); // View appointments

router.delete("/bookings/:id", protect, cancelBooking); // Cancel a booking
router.delete("/favorites/:id", protect, removeFavorite); // Remove property from favorites

export default router;
