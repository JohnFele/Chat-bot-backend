import { Router } from 'express';
import { validateMessage } from '../middleware/validation.middleware.js';
import { sendMessage, clearConversation, getServiceStatus } from '../controllers/chat.controller.js';
import { chatRateLimiter } from '../config/rateLimit.js';

const router = Router();

router.post('/message', chatRateLimiter, validateMessage, sendMessage);
router.delete('/clear/:sessionId?', clearConversation);
router.get('/status', getServiceStatus);

export default router;