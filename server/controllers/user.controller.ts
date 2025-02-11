import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/app.config";
import { asyncHandler } from "../middleware/asyncHandler";
import User from "../database/models/user.model";
import { HTTPSTATUS } from "../config/http.config";
import { Resend } from "resend";
import { verifyEmailTemplate, passwordResetTemplate } from "../mailer/template";

import { generateTokens } from "../util/generateTokens";
import { AuthenticatedRequest } from "types/express";

const resend = new Resend(config.RESEND_API_KEY);

interface TokenPayload {
  id: string;
}

const secretKey = config.JWT.JWT_SECRET;

/*
 * @route   POST api/auth/register
 * @desc    Register a new user
 * @access  Public
 */

export const register = asyncHandler(async (req: Request, res: Response) => {
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
    favorites: [],
    role: role || "user", // Default role is set to "user"
    verificationToken,
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens({
    _id: newUser._id.toString(),
    role: newUser.role,
  });

  const verificationUrl = `https://ikukuestate.vercel.app/verify-email/${verificationToken}`;

  await resend.emails.send({
    from: "Admin <onboarding@resend.dev>",
    to: [newUser.email],
    subject: "Verify Your Email Address",
    html: verifyEmailTemplate(verificationUrl).html,
  });

  // Save refresh token to the user's document
  newUser.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await newUser.save();

  // Set cookies for access and refresh tokens
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Use "lax" in development
    maxAge: 60 * 60 * 1000, // 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
    path: "/", // Ensure the path is correct
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Use "lax" in development
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // Ensure the path is correct
  });

  // Respond with the created user (excluding sensitive information)
  res.status(HTTPSTATUS.CREATED).json({
    message:
      "User registered successfully. Please verify your email to log in.",
    accessToken,
    refreshToken,
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      favorites: newUser.favorites,
      role: newUser.role,
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
  const { accessToken, refreshToken } = generateTokens({
    _id: user._id.toString(),
    role: user.role,
  });

  // Save refresh token to the user's document
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save();

  // Set cookies for access and refresh tokens
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Use "lax" in development
    maxAge: 60 * 60 * 1000, // 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
    path: "/", // Ensure the path is correct
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Use "lax" in development
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // Ensure the path is correct
  });

  // Step 6: Respond with user data (excluding sensitive info) and the token
  res.status(HTTPSTATUS.OK).json({
    message: "User logged in successfully",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      favorites: user.favorites,
      role: user.role,
    },
  });
});

/*
 * @route   POST api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */

export const getUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const user = await User.findById(userId).select(
      "-password -refreshTokens -verificationToken -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      res.status(HTTPSTATUS.NOT_FOUND);
      throw new Error("User not found");
    }

    res.status(HTTPSTATUS.OK).json(user);
  }
);

/*
 * @route   PUT api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */

export const changePassword = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      res.status(HTTPSTATUS.BAD_REQUEST);
      throw new Error("Please provide both old and new password");
    }

    const userId = req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(HTTPSTATUS.NOT_FOUND);
      throw new Error("User not found");
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(HTTPSTATUS.BAD_REQUEST);
      throw new Error("Invalid old password");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res
      .status(HTTPSTATUS.OK)
      .json({ message: "Password changed successfully" });
  }
);

/*
 * @route   PUT api/auth/update
 * @desc    Update user profile
 * @access  Private
 */

export const updateUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { firstName, lastName, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(HTTPSTATUS.NOT_FOUND);
      throw new Error("User not found");
    }

    // Update fields if provided
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
        email: user.email,
        phone: user.phone,
      },
    });
  }
);

/*
 * @route   POST api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(HTTPSTATUS.NOT_FOUND);
      throw new Error("User not found");
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, config.JWT.JWT_SECRET, {
      expiresIn: "30m", // Token expires in 30 minutes
    });

    // Save hashed token and expiry in the database
    user.resetPasswordToken = bcrypt.hashSync(resetToken, 10);
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    // Send reset email
    const resetUrl = `https://ikukuestate.vercel.app/reset-password?token=${resetToken}`;
    const { error } = await resend.emails.send({
      from: "Admin <onboarding@resend.dev>",
      to: [user.email],
      subject: "Reset your password",
      html: passwordResetTemplate(resetUrl).html,
    });

    if (error) {
      res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR);
      throw new Error("Failed to send reset email");
    }

    res.status(HTTPSTATUS.OK).json({ message: "Password reset email sent" });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { newPassword } = req.body;
    const { resetToken } = req.params;

    if (!resetToken || !newPassword) {
      res.status(HTTPSTATUS.BAD_REQUEST);
      throw new Error("Token and new password are required");
    }

    // Verify token
    const decoded = jwt.verify(resetToken, config.JWT.JWT_SECRET) as {
      id: string;
    };
    const user = await User.findById(decoded.id);

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      res.status(HTTPSTATUS.BAD_REQUEST);
      throw new Error("Invalid or expired token");
    }

    // Check if the token matches and is not expired
    const isTokenValid = await bcrypt.compare(
      resetToken,
      user.resetPasswordToken
    );
    if (!isTokenValid || user.resetPasswordExpires < new Date()) {
      res.status(HTTPSTATUS.BAD_REQUEST);
      throw new Error("Invalid or expired token");
    }

    // Update password and clear reset token fields
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(HTTPSTATUS.OK).json({ message: "Password reset successfully" });
  }
);

/*
 * @route   POST api/auth/verify-email
 * @desc    Verify user email
 * @access  Public
 */

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Invalid or expired verification token");
  }

  // Mark email as verified and clear the token
  user.emailVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(HTTPSTATUS.OK).json({ message: "Email verified successfully" });
});

/*
 * @route   POST api/auth/schedule-tour
 * @desc    Schedule a tour
 * @access  Public
 */

export const scheduleTour = asyncHandler(async (req, res) => {
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

// Refresh access token
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(HTTPSTATUS.BAD_REQUEST);
      throw new Error("Refresh token is required");
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, secretKey) as TokenPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(HTTPSTATUS.BAD_REQUEST);
      throw new Error("Invalid refresh token");
    }

    // Check if the refresh token is valid
    const validRefreshToken = user.refreshTokens.find(
      (token) => token.token === refreshToken && token.expiresAt! > new Date()
    );

    if (!validRefreshToken) {
      res.status(HTTPSTATUS.BAD_REQUEST);
      throw new Error("Invalid or expired refresh token");
    }

    // Generate new access token
    const { accessToken } = generateTokens({
      _id: user._id.toString(),
      role: user.role,
    });

    // Set new access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Use "lax" in development
      maxAge: 60 * 60 * 1000, // 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
      path: "/", // Ensure the path is correct
    });

    // Respond with success message (without tokens in the response body)
    res
      .status(HTTPSTATUS.OK)
      .json({ message: "Access token refreshed successfully", accessToken });
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(HTTPSTATUS.BAD_REQUEST);
    throw new Error("Refresh token is required");
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      config.JWT.JWT_SECRET
    ) as TokenPayload;

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(HTTPSTATUS.BAD_REQUEST);
      throw new Error("Invalid refresh token");
    }

    // Remove the refresh token
    user.refreshTokens.pull({ token: refreshToken });
    await user.save();

    // Clear cookies
    res.clearCookie("accessToken", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refreshToken", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(HTTPSTATUS.OK).json({ message: "Logout successful" });
  } catch (error) {
    // Handle invalid/expired refresh tokens gracefully
    res.clearCookie("accessToken", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refreshToken", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(HTTPSTATUS.OK).json({ message: "Session cleared" });
  }
});
