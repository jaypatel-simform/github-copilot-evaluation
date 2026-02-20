import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * UUID v4 validation regex
 */
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Middleware to validate UUID format in route parameters
 */
export const validateUUID = (paramName = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const uuid = req.params[paramName];

      if (!uuid) {
        logger.warn('UUID validation failed: parameter missing', { paramName });
        throw new BadRequestError(`Parameter '${paramName}' is required`);
      }

      if (!UUID_V4_REGEX.test(uuid)) {
        logger.warn('UUID validation failed: invalid format', { 
          paramName, 
          value: uuid 
        });
        throw new BadRequestError(`Invalid UUID format for parameter '${paramName}'`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
