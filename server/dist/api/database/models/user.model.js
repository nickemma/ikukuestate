"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
        minlength: [2, "First name must be at least 2 characters long"],
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"],
        minlength: [2, "Last name must be at least 2 characters long"],
    },
    email: {
        type: String,
        required: [true, "Please enter an email address"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            "Please enter a valid email address",
        ],
    },
    phone: {
        type: String,
        match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
        default: "+1234567890", // Default phone number
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        validate: {
            validator: function (value) {
                const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                return passwordPattern.test(value);
            },
            message: "Password must contain at least one number, one uppercase letter, one lowercase letter, and be at least 8 characters long",
        },
    },
    favorites: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Property" }],
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user", // Default role is "user"
    },
    emailVerified: {
        type: Boolean,
        default: false, // Default to false until the email is verified
    },
    verificationToken: {
        type: String, // Store the token used for email verification
        required: false,
    },
    resetPasswordToken: {
        type: String, // Store the token used for password reset
        required: false,
    },
    resetPasswordExpires: {
        type: Date, // Store the expiration date of the reset token
    },
    refreshTokens: [
        {
            token: String,
            expiresAt: Date,
        },
    ], // Array to store valid refresh tokens
}, {
    timestamps: true,
});
// Hash the password before saving to the database using the pre() hook
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next(); // If the password is not modified, continue saving
    }
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(this.get("password"), salt);
        this.set("password", hashedPassword);
        next(); // Call the next() function to continue saving
    }
    catch (error) {
        next(error); // Pass any error to the next middleware
    }
});
exports.default = mongoose_1.default.model("User", UserSchema);
