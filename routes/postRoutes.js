const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createPost, getAllPosts, getPost, updatePost, deletePost } = require('../controllers/postController');
const auth = require('../middleware/auth');

router.get('/', getAllPosts);
router.get('/:id', getPost);

router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
], createPost);

router.put('/:id', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
], updatePost);

router.delete('/:id', auth, deletePost);

module.exports = router;