import express from "express";
import {
  login,
  register,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getUserProfile,
  scheduleTour,
  refreshToken,
  logout,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.put("/updateuser", protect, updateUser);
router.put("/change-password", protect, changePassword);

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:resetToken", resetPassword);

router.get("/verify-email/:token", verifyEmail);
router.get("/profile", protect, getUserProfile);

router.post("/schedule-tour", scheduleTour);
router.post("/logout", logout);

export default router;
