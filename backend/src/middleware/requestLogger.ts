import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware to log incoming HTTP requests in format: [METHOD] /endpoint - Execution time: Xms
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `[${req.method}] ${req.url} - Execution time: ${duration}ms`;

    if (res.statusCode >= 500) {
      logger.error(logMessage, { statusCode: res.statusCode });
    } else if (res.statusCode >= 400) {
      logger.warn(logMessage, { statusCode: res.statusCode });
    } else {
      logger.info(logMessage, { statusCode: res.statusCode });
    }
  });

  next();
};
