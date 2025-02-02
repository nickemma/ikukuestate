import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { config } from "../config/app.config";
import { asyncHandler } from "./asyncHandler";
import { AuthenticatedRequest } from "../types/express";

export const protect = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Get token from cookies
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(HTTPSTATUS.UNAUTHORIZED);
      throw new Error("Unauthorized: No token provided");
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT.JWT_SECRET) as {
        id: string;
        role: string;
      };

      // Attach user to the request object
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      res.status(HTTPSTATUS.UNAUTHORIZED);
      throw new Error("Invalid or expired token");
    }
  }
);

export const admin = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
      res.status(HTTPSTATUS.FORBIDDEN);
      throw new Error("Forbidden: Not an admin");
    }
    next();
  }
);
