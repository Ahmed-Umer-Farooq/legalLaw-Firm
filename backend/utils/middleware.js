const { verifyToken } = require('./token');
const db = require('../db');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  // Check if user exists in users or lawyers table
  let user = await db('users').where({ id: decoded.id }).first();
  if (!user) {
    user = await db('lawyers').where({ id: decoded.id }).first();
  }

  if (!user) {
    return res.status(403).json({ message: 'User not found' });
  }

  req.user = { ...decoded, isAdmin: user.isAdmin || false };
  next();
};

const authenticateAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const rateLimit = (req, res, next) => {
  // Simple in-memory rate limiting (for production, use Redis or similar)
  const key = req.ip;
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  if (!global.rateLimitStore) {
    global.rateLimitStore = {};
  }

  const now = Date.now();
  if (!global.rateLimitStore[key]) {
    global.rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
  } else {
    if (now > global.rateLimitStore[key].resetTime) {
      global.rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
    } else {
      global.rateLimitStore[key].count++;
      if (global.rateLimitStore[key].count > maxRequests) {
        return res.status(429).json({ message: 'Too many requests' });
      }
    }
  }

  next();
};

module.exports = { authenticateToken, authenticateAdmin, rateLimit };
