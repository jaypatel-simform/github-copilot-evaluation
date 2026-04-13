import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { logger } from '../utils/logger';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validation failed', {
        path: req.path,
        method: req.method,
        errors
      });

      res.status(400).json({
        error: {
          message: 'Validation failed',
          statusCode: 400,
          details: errors
        }
      });
      return;
    }

    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Query validation failed', {
        path: req.path,
        method: req.method,
        errors
      });

      res.status(400).json({
        error: {
          message: 'Validation failed',
          statusCode: 400,
          details: errors
        }
      });
      return;
    }

    Object.defineProperty(req, 'query', {
      value,
      writable: true,
      configurable: true,
      enumerable: true
    });
    next();
  };
};
