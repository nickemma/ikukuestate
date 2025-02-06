"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.scheduleTour = exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.updateUser = exports.changePassword = exports.getUserProfile = exports.login = exports.register = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app_config_1 = require("../config/app.config");
const asyncHandler_1 = require("../middleware/asyncHandler");
const user_model_1 = __importDefault(require("../database/models/user.model"));
const http_config_1 = require("../config/http.config");
const resend_1 = require("resend");
const template_1 = require("../mailer/template");
const generateTokens_1 = require("../util/generateTokens");
const resend = new resend_1.Resend(app_config_1.config.RESEND_API_KEY);
const secretKey = app_config_1.config.JWT.JWT_SECRET;
/*
 * @route   POST api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    // Check if all fields are provided
    if (!firstName || !lastName || !email || !password) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Please provide all required fields");
    }
    // Check if the user already exists in the database
    const existingUser = await user_model_1.default.findOne({ email });
    if (existingUser) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("User with this email already exists");
    }
    const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
    // Create the new user
    const newUser = await user_model_1.default.create({
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
    const { accessToken, refreshToken } = (0, generateTokens_1.generateTokens)({
        _id: newUser._id.toString(),
        role: newUser.role,
    });
    const verificationUrl = `https://ikukuestate.vercel.app/verify-email/${verificationToken}`;
    await resend.emails.send({
        from: "Admin <onboarding@resend.dev>",
        to: [newUser.email],
        subject: "Verify Your Email Address",
        html: (0, template_1.verifyEmailTemplate)(verificationUrl).html,
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
    res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "User registered successfully. Please verify your email to log in.",
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
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    // Step 1: Check if both email and password are provided
    if (!email || !password) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Please provide both email and password");
    }
    // Step 2: Find the user by email in the database
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        // If user not found, respond with an error
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Invalid email or password");
    }
    // Step 3: Check if the email is verified
    if (!user.emailVerified) {
        res.status(http_config_1.HTTPSTATUS.UNAUTHORIZED);
        throw new Error("Email not verified. Please check your email.");
    }
    // Step 4: Compare the provided password with the stored hashed password
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        // If password does not match, respond with an error
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Invalid email or password");
    }
    // Step 5: Generate a token for the user upon successful login
    const { accessToken, refreshToken } = (0, generateTokens_1.generateTokens)({
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
    res.status(http_config_1.HTTPSTATUS.OK).json({
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
exports.getUserProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const user = await user_model_1.default.findById(userId).select("-password -refreshTokens -verificationToken -resetPasswordToken -resetPasswordExpires");
    if (!user) {
        res.status(http_config_1.HTTPSTATUS.NOT_FOUND);
        throw new Error("User not found");
    }
    res.status(http_config_1.HTTPSTATUS.OK).json(user);
});
/*
 * @route   PUT api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
exports.changePassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // Validate input
    if (!oldPassword || !newPassword) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Please provide both old and new password");
    }
    const userId = req.user?.id;
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        res.status(http_config_1.HTTPSTATUS.NOT_FOUND);
        throw new Error("User not found");
    }
    // Check if the old password matches
    const isMatch = await bcrypt_1.default.compare(oldPassword, user.password);
    if (!isMatch) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Invalid old password");
    }
    // Update password
    user.password = newPassword;
    await user.save();
    res
        .status(http_config_1.HTTPSTATUS.OK)
        .json({ message: "Password changed successfully" });
});
/*
 * @route   PUT api/auth/update
 * @desc    Update user profile
 * @access  Private
 */
exports.updateUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const { firstName, lastName, phone } = req.body;
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        res.status(http_config_1.HTTPSTATUS.NOT_FOUND);
        throw new Error("User not found");
    }
    // Update fields if provided
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    await user.save();
    res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "User profile updated successfully",
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
        },
    });
});
/*
 * @route   POST api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
exports.forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        res.status(http_config_1.HTTPSTATUS.NOT_FOUND);
        throw new Error("User not found");
    }
    // Generate reset token
    const resetToken = jsonwebtoken_1.default.sign({ id: user._id }, app_config_1.config.JWT.JWT_SECRET, {
        expiresIn: "30m", // Token expires in 30 minutes
    });
    // Save hashed token and expiry in the database
    user.resetPasswordToken = bcrypt_1.default.hashSync(resetToken, 10);
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();
    // Send reset email
    const resetUrl = `https://ikukuestate.vercel.app/reset-password?token=${resetToken}`;
    const { error } = await resend.emails.send({
        from: "Admin <onboarding@resend.dev>",
        to: [user.email],
        subject: "Reset your password",
        html: (0, template_1.passwordResetTemplate)(resetUrl).html,
    });
    if (error) {
        res.status(http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR);
        throw new Error("Failed to send reset email");
    }
    res.status(http_config_1.HTTPSTATUS.OK).json({ message: "Password reset email sent" });
});
exports.resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { newPassword } = req.body;
    const { resetToken } = req.params;
    if (!resetToken || !newPassword) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Token and new password are required");
    }
    // Verify token
    const decoded = jsonwebtoken_1.default.verify(resetToken, app_config_1.config.JWT.JWT_SECRET);
    const user = await user_model_1.default.findById(decoded.id);
    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Invalid or expired token");
    }
    // Check if the token matches and is not expired
    const isTokenValid = await bcrypt_1.default.compare(resetToken, user.resetPasswordToken);
    if (!isTokenValid || user.resetPasswordExpires < new Date()) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Invalid or expired token");
    }
    // Update password and clear reset token fields
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(http_config_1.HTTPSTATUS.OK).json({ message: "Password reset successfully" });
});
/*
 * @route   POST api/auth/verify-email
 * @desc    Verify user email
 * @access  Public
 */
exports.verifyEmail = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { token } = req.params;
    const user = await user_model_1.default.findOne({ verificationToken: token });
    if (!user) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Invalid or expired verification token");
    }
    // Mark email as verified and clear the token
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(http_config_1.HTTPSTATUS.OK).json({ message: "Email verified successfully" });
});
/*
 * @route   POST api/auth/schedule-tour
 * @desc    Schedule a tour
 * @access  Public
 */
exports.scheduleTour = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;
    // Validate input fields
    if (!firstName || !lastName || !email) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
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
    res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Tour scheduled successfully. Email sent to the admin.",
    });
});
// Refresh access token
exports.refreshToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Refresh token is required");
    }
    // Verify refresh token
    const decoded = jsonwebtoken_1.default.verify(refreshToken, secretKey);
    const user = await user_model_1.default.findById(decoded.id);
    if (!user) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Invalid refresh token");
    }
    // Check if the refresh token is valid
    const validRefreshToken = user.refreshTokens.find((token) => token.token === refreshToken && token.expiresAt > new Date());
    if (!validRefreshToken) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Invalid or expired refresh token");
    }
    // Generate new access token
    const { accessToken } = (0, generateTokens_1.generateTokens)({
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
        .status(http_config_1.HTTPSTATUS.OK)
        .json({ message: "Access token refreshed successfully", accessToken });
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Refresh token is required");
    }
    // Verify refresh token
    const decoded = jsonwebtoken_1.default.verify(refreshToken, app_config_1.config.JWT.JWT_SECRET);
    const user = await user_model_1.default.findById(decoded.id);
    if (!user) {
        res.status(http_config_1.HTTPSTATUS.BAD_REQUEST);
        throw new Error("Invalid refresh token");
    }
    // Remove the refresh token from the user's document using Mongoose's `pull` method
    user.refreshTokens.pull({ token: refreshToken }); // Remove the token object matching the `token` field
    await user.save();
    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    // Respond with success message
    res.status(http_config_1.HTTPSTATUS.OK).json({ message: "Logout successful" });
});
