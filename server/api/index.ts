import * as dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// files import
import { config } from "../config/app.config";
import connectDB from "../database/database";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middleware/asyncHandler";
import authRoutes from "../routes/user.routes";
import propertyRoutes from "../routes/property.routes";
import regionRoutes from "../routes/region.routes";
import FavoriteRoutes from "../routes/user.handlers.routes";
import { errorHandler } from "../middleware/errorHandler";

const app = express();
//============= Middlewares
// Make sure this comes FIRST before any routes
app.use(
  cors({
    origin: ["http://localhost:5173", "https://ikukuestate.vercel.app"],
    credentials: true,
  })
);
// Handle preflight requests
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

//============= test Route for server
app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Hello Ikuku Properties",
    });
  })
);

//============= Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", FavoriteRoutes);
app.use("/api/v1/admin", propertyRoutes);
app.use("/api/v1/admin", regionRoutes);

app.use(errorHandler);

// Connect to DB and start server (Vercel will handle this)
// connectDB().catch(console.error);
const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
// Export for Vercel serverless
export default app;
