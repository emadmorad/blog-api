const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { register, login, refresh, logout } = require('../controllers/userController');

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 10, // Limit to 10 attempts only
  message: { message: 'Too many attempts, please try again later' }
});

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.post('/refresh', authLimiter, refresh);
router.post('/logout', logout);

module.exports = router;