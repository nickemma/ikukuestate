import mongoose, { InferSchemaType } from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    // city: { type: String, required: true },
    // type: {
    //   type: String,
    //   enum: [
    //     "home/apartments",
    //     "lands/plots",
    //     "eventcenter/venues",
    //     "shortlet",
    //     "commercial property",
    //   ],
    //   required: true,
    // },
    // price: { type: Number, required: true },
    // propertyDetails: { type: String, required: true },
    // beds: { type: Number, required: true },
    // baths: { type: Number, required: true },
    // sqft: { type: Number, required: true },
    furnished: { type: Boolean, required: true },
    images: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

export type PropertyType = InferSchemaType<typeof PropertySchema>;

export default mongoose.model("Property", PropertySchema);
