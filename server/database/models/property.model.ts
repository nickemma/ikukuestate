import mongoose, { InferSchemaType } from "mongoose";

const basePropertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    propertyType: {
      type: String,
      required: true,
      enum: ["House", "Land"],
      default: "House",
    },
    price: { type: Number, required: true },
    sqft: { type: Number, required: true },
    images: [{ type: String, required: true }],
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "propertyType",
  }
);

export type BaseProperty = InferSchemaType<typeof basePropertySchema>;

export default mongoose.model("BaseProperty", basePropertySchema);
