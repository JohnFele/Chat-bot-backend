import { ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants.util.js';

const errorMap = {
  'Invalid Gemini API key': {
    message: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
    statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
  },
  'API quota exceeded': {
    message: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
    statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
  },
  'safety': {
    message: ERROR_MESSAGES.MESSAGE_PROCESSING_ERROR,
    statusCode: HTTP_STATUS.BAD_REQUEST,
  },
  'blocked': {
    message: ERROR_MESSAGES.MESSAGE_PROCESSING_ERROR,
    statusCode: HTTP_STATUS.BAD_REQUEST,
  },
  'Failed to get response': {
    message: ERROR_MESSAGES.CONNECTION_ERROR,
    statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
  },
  'Rate limit': {
    message: ERROR_MESSAGES.RATE_LIMIT,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  },
};

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  let error = {
    message: ERROR_MESSAGES.INTERNAL_ERROR,
    statusCode: HTTP_STATUS.INTERNAL_ERROR,
  };

  if (err.statusCode === HTTP_STATUS.BAD_REQUEST) {
    error = {
      message: err.message || 'Bad request',
      statusCode: HTTP_STATUS.BAD_REQUEST,
    };
  } else {
    const errMsg = err.message || '';
    for (const [key, value] of Object.entries(errorMap)) {
      if (errMsg.includes(key)) {
        error = value;
        break;
      }
    }
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export default errorHandler;