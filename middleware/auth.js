const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {

  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('No token, access denied');
    err.status = 401;
    return next(err);
  }

  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      const err = new Error('User no longer exists');
      err.status = 401;
      return next(err);
    }

    req.user = decoded;

    next();

  } catch (err) {

    err.status = 401;
    err.message = 'Invalid or expired token';
    next(err);

  }

};

module.exports = auth;