import jwt from "jsonwebtoken";

import { HTTPSTATUS } from "../config/http.config";
import { config } from "../config/app.config";
import { asyncHandler } from "./asyncHandler";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const cookieToken = req.cookies.token;
    const token = cookieToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(HTTPSTATUS.UNAUTHORIZED);
      throw new Error("Unauthorized: No token provided");
    }

    try {
      const decoded = jwt.verify(token, config.JWT.JWT_SECRET) as {
        id: string;
        role: string;
      };

      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid token");
    }
  }
);

export const admin = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
      res.status(HTTPSTATUS.UNAUTHORIZED);
      throw new Error("Unauthorized: Not an admin");
    }
    next();
  }
);
