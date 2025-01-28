import * as dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// files import
import { config } from "./config/app.config";
import connectDB from "./database/database";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middleware/asyncHandler";
import authRoutes from "./routes/user.routes";
import propertyRoutes from "./routes/property.routes";
import regionRoutes from "./routes/region.routes";
import FavoriteRoutes from "./routes/user.handlers.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
//============= Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  })
);
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

//============= Server
app.listen(config.PORT, async () => {
  await connectDB();
  console.log(`Server running on port http://localhost:${config.PORT}`);
});
