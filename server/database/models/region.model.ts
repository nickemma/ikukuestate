import mongoose, { InferSchemaType } from "mongoose";

const RegionSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true, uppercase: true },
  image: { type: String, required: true },
});

export type RegionType = InferSchemaType<typeof RegionSchema>;

export default mongoose.model("Region", RegionSchema);
