const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const register = function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  user.save().then(function(savedUser) {
    res.status(201).json({ message: 'User created successfully' });
  }).catch(function(err) {
    res.status(400).json({ message: err.message });
  });
};

const login = function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  User.findOne({ email: req.body.email }).then(function(user) {
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    user.save().then(function() {
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    });

  }).catch(function(err) {
    res.status(500).json({ message: err.message });
  });
};

const refresh = function(req, res) {
  const token = req.body.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  User.findOne({ refreshToken: token }).then(function(user) {
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    try {
      jwt.verify(token, process.env.REFRESH_SECRET);

      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken: accessToken });
    } catch (err) {
      res.status(403).json({ message: 'Refresh token expired' });
    }

  }).catch(function(err) {
    res.status(500).json({ message: err.message });
  });
};

const logout = function(req, res) {
  User.findOne({ refreshToken: req.body.refreshToken }).then(function(user) {
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.refreshToken = null;
    user.save().then(function() {
      res.json({ message: 'Logged out successfully' });
    });

  }).catch(function(err) {
    res.status(500).json({ message: err.message });
  });
};

module.exports = { register, login, refresh, logout };




