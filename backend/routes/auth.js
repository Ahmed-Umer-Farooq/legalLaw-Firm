const express = require('express');
const passport = require('../config/passport');
const { authenticateToken, authenticateAdmin } = require('../utils/middleware');
const { authLimiter } = require('../utils/limiter');
const {
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  deleteAccount,
} = require('../controllers/authController');
const { registerUser, loginUser } = require('../controllers/userController');
const { registerLawyer, loginLawyer } = require('../controllers/lawyerController');

const router = express.Router();

// Registration
router.post('/register-user', authLimiter, registerUser);
router.post('/register-lawyer', authLimiter, registerLawyer);

// Login
router.post('/login', authLimiter, login);

// Email verification
router.post('/verify-email', verifyEmail);

// Password reset
router.post('/forgot-password', authLimiter, forgotPassword);
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
