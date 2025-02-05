import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { config } from "../config/app.config";
import { asyncHandler } from "./asyncHandler";
import { AuthenticatedRequest } from "../types/express";

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, config.JWT.JWT_SECRET) as {
        id: string;
        role: string;
      };

      req.user = { id: decoded.id, role: decoded.role };

      next();
    } catch (error: any) {
      console.error("Token verification failed:", error.message);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
};

export const admin = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
      res.status(HTTPSTATUS.FORBIDDEN);
      throw new Error("Forbidden: Not an admin");
    }
    next();
  }
);
