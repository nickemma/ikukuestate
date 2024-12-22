import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../util/AppError";
import { clearAuthenticationCookies, REFRESH_PATH } from "../util/cookies";

const formatZodError = (error: z.ZodError, res: Response): any => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errors: errors,
  });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  console.error(`Error occurred on PATH: ${req.path}`, error);

  if (req.path === REFRESH_PATH) {
    clearAuthenticationCookies(res);
  }

  if (error instanceof SyntaxError) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "Invalid JSON payload passed." });
  }

  if (error instanceof z.ZodError) {
    return formatZodError(error, res);
  }

  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, errorCode: error.errorCode });
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknown error occurred",
  });
};
