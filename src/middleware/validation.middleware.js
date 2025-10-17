import { body, validationResult } from 'express-validator';
import { VALIDATION } from '../utils/constants.js';

export const validateMessage = [
  body('message')
    .trim()
    .isLength({ 
      min: VALIDATION.MESSAGE.MIN_LENGTH, 
      max: VALIDATION.MESSAGE.MAX_LENGTH 
    })
    .withMessage(`Message must be between ${VALIDATION.MESSAGE.MIN_LENGTH} and ${VALIDATION.MESSAGE.MAX_LENGTH} characters`)
    .escape(),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Invalid message',
      details: errors.array()[0].msg,
    });
  }
  next();
};