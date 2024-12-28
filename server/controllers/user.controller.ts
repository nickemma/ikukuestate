import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/app.config";
import { asyncHandler } from "../middleware/asyncHandler";
import User from "../database/models/user.model";
import { HTTPSTATUS } from "../config/http.config";
import { Resend } from "resend";
import { verifyEmailTemplate, passwordResetTemplate } from "../mailer/template";

const resend = new Resend(config.RESEND_API_KEY);

/*
 * @desc    Generate a token
 * @access  Private
 */
const secretKey = config.JWT.JWT_SECRET;
const tokenExpiration = config.JWT.JWT_EXPIRES_IN;
// Utility function to generate JWT token
const generateToken = (user: { _id: string; role: string }) => {
  return jwt.sign({ id: user._id, role: user.role }, secretKey, {
    expiresIn: tokenExpiration,
  });
};

/*
 * @route   POST api/auth/register
 * @desc    Register a new user
 * @access  Public
 */

export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  // Check if all fields are provided
  if (!firstName || !lastName || !email || !phone || !password) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Please provide all required fields");
  }

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("User with this email already exists");
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  // Create the new user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: "user", // Default role is set to "user"
    verificationToken,
  });

  const verificationUrl = `${config.APP_ORIGIN}/verify-email/${verificationToken}`;

  await resend.emails.send({
    from: "Admin <onboarding@resend.dev>",
    to: [newUser.email],
    subject: "Verify Your Email Address",
    html: verifyEmailTemplate(verificationUrl).html,
  });

  // Respond with the created user (excluding sensitive information)
  res.status(HTTPSTATUS.CREATED).json({
    message:
      "User registered successfully. Please verify your email to log in.",
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
    },
  });
});

/*
 * @route   POST api/auth/login
 * @desc    Login a user
 * @access  Public
 */

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if all fields are provided
  if (!email || !password) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Please provide both email and password");
  }

  // Check if the user exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Invalid email or password");
  }

  // Check if the email is verified
  if (!user.emailVerified) {
    res.status(HTTPSTATUS.UNAUTHORIZED);
    throw new Error("Email not verified. Please check your email.");
  }

  // Check if the password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken({ _id: user._id.toString(), role: user.role });

  // Respond with the logged in user (excluding sensitive information)
  res.status(HTTPSTATUS.OK).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
    token,
  });
});

/*
 * @route   POST api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = (req as any).user?.id;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    res.status(HTTPSTATUS.NOT_FOUND);
    throw new Error("User not found");
  }

  res.status(HTTPSTATUS.OK).json(user);
});

/*
 * @route   PUT api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // validate if the old password is correct
  if (!oldPassword || !newPassword) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Please provide both old and new password");
  }
  const userId = (req as any).user?.id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(HTTPSTATUS.NOT_FOUND);
    throw new Error("User not found");
  }

  // Check if old password matches
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Invalid old password");
  }

  // Hash the new password and save it
  user.password = newPassword;
  await user.save();

  // Respond with the updated user (excluding sensitive information)
  res.status(HTTPSTATUS.OK).json({
    message: "Password changed successfully",
  });
});

/*
 * @route   PUT api/auth/update
 * @desc    Update user profile
 * @access  Private
 */

export const updateUser = asyncHandler(async (req, res) => {
  const userId = (req as any).user?.id;
  const { firstName, lastName, phone } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(HTTPSTATUS.NOT_FOUND);
    throw new Error("User not found");
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.phone = phone || user.phone;

  await user.save();

  res.status(HTTPSTATUS.OK).json({
    message: "User profile updated successfully",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email, // email cannot be updated
      phone: user.phone,
    },
  });
});

/*
 * @route   POST api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(HTTPSTATUS.NOT_FOUND);
    throw new Error("User not found");
  }
  // Generate reset token (include an expiration mechanism)
  const resetToken = generateToken({
    _id: user._id.toString(),
    role: user.role,
  }); // Token logic

  user.resetPasswordToken = bcrypt.hashSync(resetToken, 10); // Save hashed token in DB
  user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // Set expiry to 30 mins
  await user.save();

  const resetUrl = `${config.APP_ORIGIN}/reset-password?token=${resetToken}`;

  // Send reset email
  const { data, error } = await resend.emails.send({
    from: "Admin <onboarding@resend.dev>",
    to: [user.email],
    subject: "Reset your password",
    html: passwordResetTemplate(resetUrl).html,
  });

  if (error) {
    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR);
    throw new Error("Failed to send reset email");
  }

  res
    .status(HTTPSTATUS.OK)
    .json({ message: "Password reset email sent", data });
});

/*
 * @route   PUT api/auth/reset-password/:token
 * @desc    Reset user password
 * @access  Public
 */

function isJwtPayload(obj: any): obj is JwtPayload {
  return typeof obj === "object" && obj !== null;
}

export const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const token = req.params.resetToken; // Extract token from route

  if (!token || !newPassword) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Token and new password are required");
  }

  const decoded = jwt.verify(token, config.JWT.JWT_SECRET); // Decode token

  if (!isJwtPayload(decoded) || !decoded.id) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Invalid token payload");
  }
  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Invalid or expired token");
  }

  user.password = newPassword;
  await user.save();

  res.status(HTTPSTATUS.OK).json({ message: "Password reset successfully" });
});

/*
 * @route   POST api/auth/verify-email
 * @desc    Verify user email
 * @access  Public
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Invalid or expired verification token");
  }

  user.emailVerified = true;
  user.verificationToken = undefined; // Clear the token after verification
  await user.save();

  res.status(HTTPSTATUS.OK).json({ message: "Email verified successfully" });
});
