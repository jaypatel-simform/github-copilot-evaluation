import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

interface ErrorResponse {
  error: {
    message: string;
    statusCode: number;
    stack?: string;
  };
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default to 500 server error
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Check if it's our custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Log the error with appropriate level
  const errorLog = {
    message: err.message,
    statusCode,
    path: req.path,
    method: req.method,
    stack: err.stack,
    isOperational
  };

  if (statusCode >= 500) {
    logger.error('Server error occurred', errorLog);
  } else if (statusCode >= 400) {
    logger.warn('Client error occurred', errorLog);
  }

  // Prepare error response
  const errorResponse: ErrorResponse = {
    error: {
      message,
      statusCode
    }
  };

  // Include stack trace in development mode
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    errorResponse.error.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};
