import { type Request, type Response, type NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${duration}ms`;

    if (res.statusCode >= 400) {
      logger.error(message); // Grava automaticamente no error.log
    } else {
      logger.info(message);  // Grava no combined.log
    }
  });

  next();
};
