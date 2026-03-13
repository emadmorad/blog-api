const Post = require('../models/Post');
const { validationResult } = require('express-validator');

const createPost = function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id
  });

  post.save().then(function(savedPost) {
    res.status(201).json(savedPost);
  }).catch(function(err) {
    res.status(400).json({ message: err.message });
  });
};

const getAllPosts = function(req, res) {
  Post.find().then(function(posts) {
    res.json(posts);
  }).catch(function(err) {
    res.status(500).json({ message: err.message });
  });
};

const getPost = function(req, res) {
  Post.findById(req.params.id).then(function(post) {
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  }).catch(function(err) {
    res.status(500).json({ message: err.message });
  });
};

const updatePost = function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Post.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, content: req.body.content },
    { new: true }
  ).then(function(post) {
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  }).catch(function(err) {
    res.status(500).json({ message: err.message });
  });
};

const deletePost = function(req, res) {
  Post.findById(req.params.id).then(function(post) {
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    Post.findByIdAndDelete(req.params.id).then(function() {
      res.json({ message: 'Post deleted' });
    });

  }).catch(function(err) {
    res.status(500).json({ message: err.message });
  });
};

module.exports = { createPost, getAllPosts, getPost, updatePost, deletePost };