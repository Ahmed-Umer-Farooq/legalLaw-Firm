const express = require('express');
const passport = require('../config/passport');
const { rateLimit } = require('../utils/middleware');
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  deleteAccount,
} = require('../controllers/authController');
const { authenticateToken } = require('../utils/middleware');

const router = express.Router();

// Rate limiting for auth routes
router.use(rateLimit);

// Registration
router.post('/register', register);

// Login
router.post('/login', login);

// Email verification
router.post('/verify-email', verifyEmail);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Profile management
router.get('/me', authenticateToken, getProfile);
router.put('/me', authenticateToken, updateProfile);
router.delete('/me', authenticateToken, deleteAccount);

// OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${req.user.token}`);
  }
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${req.user.token}`);
  }
);

module.exports = router;
