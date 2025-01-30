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
  const { firstName, lastName, email, password, role } = req.body;

  // Check if all fields are provided
  if (!firstName || !lastName || !email || !password) {
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
    phone: req.body.phone,
    password,
    role: role || "user", // Default role is set to "user"
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

  // Step 1: Check if both email and password are provided
  if (!email || !password) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Please provide both email and password");
  }

  // Step 2: Find the user by email in the database
  const user = await User.findOne({ email });
  if (!user) {
    // If user not found, respond with an error
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Invalid email or password");
  }

  // Step 3: Check if the email is verified
  if (!user.emailVerified) {
    res.status(HTTPSTATUS.UNAUTHORIZED);
    throw new Error("Email not verified. Please check your email.");
  }

  // Step 4: Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    // If password does not match, respond with an error
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Invalid email or password");
  }

  // Step 5: Generate a token for the user upon successful login
  const token = generateToken({ _id: user._id.toString(), role: user.role });

  // Step 6: Respond with user data (excluding sensitive info) and the token
  res.status(HTTPSTATUS.OK).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
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

  // Step 1: Validate if both old and new passwords are provided
  if (!oldPassword || !newPassword) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Please provide both old and new password");
  }

  // Step 2: Get user ID from the request object (assuming user is authenticated)
  const userId = (req as any).user?.id;

  // Step 3: Find the user by ID in the database
  const user = await User.findById(userId);
  if (!user) {
    // If user not found, respond with an error
    res.status(HTTPSTATUS.NOT_FOUND);
    throw new Error("User not found");
  }

  // Step 4: Check if the old password matches the stored password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    // If old password does not match, respond with an error
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Invalid old password");
  }

  // Step 5: Update the user password with the new password
  user.password = newPassword;

  // Step 6: Save the updated user object
  await user.save();

  // Step 7: Respond with a success message
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

/*
 * @route   POST api/auth/schedule-tour
 * @desc    Schedule a tour
 * @access  Public
 */

export const scheduleTour = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email, phone, message } = req.body;

  // Validate input fields
  if (!firstName || !lastName || !email) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Please provide all required fields.");
  }

  // Prepare email content
  const emailContent = `
    <h1>New Property Tour Scheduled</h1>
    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
    <p><strong>Message:</strong> ${message || "No additional notes"}</p>
  `;

  // Send email using Resend
  await resend.emails.send({
    from: "Admin <onboarding@resend.dev>",
    to: "nicholasemmanuel321@gmail.com",
    subject: `Tour Scheduled by ${firstName} ${lastName}`,
    html: emailContent,
  });

  // Respond to the client
  res.status(HTTPSTATUS.OK).json({
    message: "Tour scheduled successfully. Email sent to the admin.",
  });
});
