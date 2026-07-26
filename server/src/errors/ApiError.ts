export interface ApiError extends Error {
  statusCode: number;
  details?: unknown;
  isApiError: true;
}

export const createApiError = (statusCode: number, message: string, details?: unknown): ApiError => {
  const error = new Error(message) as ApiError;
  error.name = "ApiError";
  error.statusCode = statusCode;
  error.details = details;
  error.isApiError = true;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createApiError);
  }
  return error;
};

export const isApiError = (err: unknown): err is ApiError => {
  return (
    typeof err === "object" &&
    err !== null &&
    ((err as ApiError).isApiError === true || typeof (err as ApiError).statusCode === "number")
  );
};

export const BadRequestError = (message = "Bad Request", details?: unknown): ApiError =>
  createApiError(400, message, details);

export const UnauthorizedError = (message = "Unauthorized access", details?: unknown): ApiError =>
  createApiError(401, message, details);

export const ForbiddenError = (message = "Forbidden resource", details?: unknown): ApiError =>
  createApiError(403, message, details);

export const NotFoundError = (message = "Resource not found", details?: unknown): ApiError =>
  createApiError(404, message, details);

export const ConflictError = (message = "Resource conflict", details?: unknown): ApiError =>
  createApiError(409, message, details);

export const ValidationError = (message = "Validation failed", details?: unknown): ApiError =>
  createApiError(422, message, details);

