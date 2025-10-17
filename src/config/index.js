import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = NODE_ENV === 'development' ? 'http://localhost:5173' : process.env.CORS_ORIGIN || 'http://localhost:5173';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 50;
const GEMINI_BASE_URL = process.env.GEMINI_BASE_URL;
const GEMINI_MODEL = process.env.GEMINI_MODEL;
const GEMINI_TIMEOUT = 30000;
const GEMINI_MAX_HISTORY_LENGTH = 20;

const config = {
  PORT,
  NODE_ENV,
  CORS_ORIGIN,
  GEMINI_API_KEY,
  RATE_LIMIT : {
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
  },
  GEMINI: {
    BASE_URL: GEMINI_BASE_URL,
    MODEL: GEMINI_MODEL,
    TIMEOUT: GEMINI_TIMEOUT,
    MAX_HISTORY_LENGTH: GEMINI_MAX_HISTORY_LENGTH
  },
};

export default config;