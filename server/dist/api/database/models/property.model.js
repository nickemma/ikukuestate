"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PropertySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    propertyType: { type: String, required: true },
    price: { type: Number, required: true },
    propertyDetails: { type: String, required: true },
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    sqft: { type: Number, required: true },
    furnished: { type: Boolean, required: true },
    images: [{ type: String, required: true }],
    features: { type: String, required: true },
    region: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Region",
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Property", PropertySchema);
