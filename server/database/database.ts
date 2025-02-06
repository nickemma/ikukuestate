import mongoose from "mongoose";
import { config } from "../config/app.config";

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
