const jwt = require('jsonwebtoken');
require('dotenv').config();

// Ideally this should be in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'secret_kitchen_key_123'; 

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Adds user payload (e.g., { id: '...' }) to req
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
