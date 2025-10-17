import rateLimit from 'express-rate-limit';
import config from './index.js';

export const createRateLimiter = (options = {}) => rateLimit({
  windowMs: config.RATE_LIMIT.windowMs,
  max: config.RATE_LIMIT.max,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  ...options,
});

export const chatRateLimiter = createRateLimiter();