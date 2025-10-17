import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import config from '../config/index.js';

export const securityMiddleware = [
  helmet({}),
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  }),
  compression(),
];