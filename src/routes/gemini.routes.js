import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import geminiService from '../services/gemini.service.js';

const router = Router();

// ✅ Validation rules
const messageValidation = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
    .escape()
];

// ✅ Send message to Gemini AI
router.post('/message', messageValidation, async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message',
        details: errors.array()[0].msg,
      });
    }

    const { message, sessionId = 'default' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
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

    let statusCode = 500;
    let errorMessage = 'Failed to process message';

    const errMsg = error.message || '';

    if (errMsg.includes('API key') || errMsg.includes('quota')) {
      statusCode = 403;
      errorMessage = 'Service temporarily unavailable';
    } else if (errMsg.includes('Rate limit')) {
      statusCode = 429;
      errorMessage = 'Too many requests, please try again later';
    } else if (errMsg.includes('Invalid request')) {
      statusCode = 400;
      errorMessage = errMsg;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
});

// ✅ Clear conversation
router.delete('/clear/:sessionId?', async (req, res) => {
  try {
    const sessionId = req.params.sessionId || 'default';
    geminiService.clearConversation(sessionId);

    res.json({ success: true, message: `Session ${sessionId} cleared` });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to clear conversation',
    });
  }
});

// ✅ Get service status
router.get('/status', async (req, res) => {
  try {
    const stats = geminiService.getStats();
    res.json({
      success: true,
      ...stats,
      status: 'operational',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Service status unavailable',
    });
  }
});

export default router;
