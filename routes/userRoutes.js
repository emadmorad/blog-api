const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, refresh, logout } = require('../controllers/userController');

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;