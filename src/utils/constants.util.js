export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Invalid Gemini API key',
  API_QUOTA_EXCEEDED: 'API quota exceeded',
  MESSAGE_BLOCKED: 'Message blocked or invalid request',
  ACCESS_DENIED: 'Access denied',
  MODEL_NOT_FOUND: 'Model not found or unsupported for generateContent',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  RATE_LIMIT: 'Too many requests, please try again later',
  INVALID_REQUEST: 'Invalid request',
  INTERNAL_ERROR: 'Internal server error',
  MESSAGE_PROCESSING_ERROR: 'Message could not be processed due to content filters',
  CONNECTION_ERROR: 'Temporarily unable to connect to AI service',
};

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const VALIDATION = {
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
};

export const SAFETY_SETTINGS = [
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
];