import { Request, Response, NextFunction } from "express";
import { isApiError, ApiError } from "../errors/ApiError";
import { logger } from "../utils/logger";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}`, {
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });

  if (isApiError(err)) {
    const apiErr = err as ApiError;
    res.status(apiErr.statusCode).json({
      success: false,
      error: apiErr.message,
      details: apiErr.details,
    });
    return;
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    res.status(422).json({
      success: false,
      error: "Validation failed",
      details: formattedErrors,
    });
    return;
  }

  // Handle Mongoose Duplicate Key Error (11000)
  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      error: "Resource already exists with unique field conflict",
    });
    return;
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
};
