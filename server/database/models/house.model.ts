import mongoose from "mongoose";
import BaseProperty from "./property.model";

const houseSchema = new mongoose.Schema({
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  furnished: { type: Boolean, required: true },
  propertyDetails: { type: String, required: true },
  features: { type: String, required: true },
});

export const House = BaseProperty.discriminator("House", houseSchema);
