import mongoose from "mongoose";
import BaseProperty from "./property.model";

const landSchema = new mongoose.Schema({});

export const Land = BaseProperty.discriminator("Land", landSchema);
