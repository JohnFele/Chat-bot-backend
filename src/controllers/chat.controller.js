import geminiService from '../services/gemini.service.js';
import { ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants.util.js';
import { handleValidationErrors } from '../middleware/validation.middleware.js';

export const sendMessage = [
  handleValidationErrors,
  async (req, res) => {
    try {
      const { message, sessionId = 'default' } = req.body;

      if (!message?.trim()) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          success: false, 
          error: 'Message cannot be empty' 
        });
      }

      const response = await geminiService.sendMessage(message, sessionId);

      res.json({
        success: true,
        response: response.text,
        mimeType: response.mimeType,
        timestamp: response.timestamp,
        sessionId: response.sessionId,
      });
    } catch (error) {
      console.error('Chat error:', error);

      const errMsg = error.message || '';
      let statusCode = HTTP_STATUS.INTERNAL_ERROR;
      let errorMessage = ERROR_MESSAGES.CONNECTION_ERROR;

      if (errMsg.includes(ERROR_MESSAGES.INVALID_API_KEY) || errMsg.includes(ERROR_MESSAGES.API_QUOTA_EXCEEDED)) {
        statusCode = HTTP_STATUS.FORBIDDEN;
        errorMessage = ERROR_MESSAGES.SERVICE_UNAVAILABLE;
      } else if (errMsg.includes(ERROR_MESSAGES.RATE_LIMIT)) {
        statusCode = HTTP_STATUS.TOO_MANY_REQUESTS;
        errorMessage = ERROR_MESSAGES.RATE_LIMIT;
      } else if (errMsg.includes(ERROR_MESSAGES.INVALID_REQUEST)) {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        errorMessage = errMsg;
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
    }
  },
];

export const clearConversation = async (req, res) => {
  try {
    const sessionId = req.params.sessionId || 'default';
    geminiService.clearConversation(sessionId);

    res.json({ 
      success: true, 
      message: `Session ${sessionId} cleared` 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      error: 'Failed to clear conversation',
    });
  }
};

export const getServiceStatus = async (req, res) => {
  try {
    const stats = geminiService.getStats();
    res.json({
      success: true,
      ...stats,
      status: 'operational',
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      error: 'Service status unavailable',
    });
  }
};