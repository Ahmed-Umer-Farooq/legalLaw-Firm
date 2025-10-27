const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../db');
const { generateToken } = require('../utils/token');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../utils/mailer');

// Mock email sending for testing (remove when email is configured)
const mockSendVerificationEmail = async (email, code) => {
  console.log(`MOCK EMAIL: Verification code for ${email}: ${code}`);
};

const mockSendResetPasswordEmail = async (email, resetToken) => {
  console.log(`MOCK EMAIL: Reset link for ${email}: http://localhost:3000/reset-password?token=${resetToken}`);
};

const { validateRegistration, validateLogin } = require('../utils/validator');

const login = async (req, res) => {
  try {
    const { email, password, registration_id } = req.body;

    const validation = validateLogin({ email, password, registration_id });
    if (!validation.isValid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    let user;
    let role;

    // Check users table
    if (email) {
      user = await db('users').where({ email }).first();
      role = 'user';
    }

    // If not found in users, check lawyers table
    if (!user && registration_id) {
      user = await db('lawyers').where({ registration_id }).first();
      role = 'lawyer';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.email_verified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Check users table
    let user = await db('users').where({ email, email_verification_code: code }).first();
    if (user) {
      await db('users').where({ id: user.id }).update({
        email_verified: true,
        email_verification_code: null,
      });
      return res.json({ message: 'Email verified successfully' });
    }

    // Check lawyers table
    user = await db('lawyers').where({ email, email_verification_code: code }).first();
    if (user) {
      await db('lawyers').where({ id: user.id }).update({
        email_verified: true,
        email_verification_code: null,
      });
      return res.json({ message: 'Email verified successfully' });
    }

    return res.status(400).json({ message: 'Invalid verification code' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check users table
    let user = await db('users').where({ email }).first();
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      await db('users').where({ id: user.id }).update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      });

      await mockSendResetPasswordEmail(email, resetToken);
      return res.json({ message: 'Password reset link sent to your email' });
    }

    // Check lawyers table
    user = await db('lawyers').where({ email }).first();
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      await db('lawyers').where({ id: user.id }).update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      });

      await mockSendResetPasswordEmail(email, resetToken);
      return res.json({ message: 'Password reset link sent to your email' });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6 || !/\d/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters and include a number' });
    }

    // Check users table
    let user = await db('users')
      .where({ reset_token: token })
      .andWhere('reset_token_expiry', '>', new Date())
      .first();

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db('users').where({ id: user.id }).update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      });

      return res.json({ message: 'Password reset successfully' });
    }

    // Check lawyers table
    user = await db('lawyers')
      .where({ reset_token: token })
      .andWhere('reset_token_expiry', '>', new Date())
      .first();

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db('lawyers').where({ id: user.id }).update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      });

      return res.json({ message: 'Password reset successfully' });
    }

    return res.status(400).json({ message: 'Invalid or expired reset token' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    // Check users table
    let user = await db('users').where({ id: req.user.id }).select('id', 'name', 'username', 'email', 'address', 'zip_code', 'city', 'state', 'country', 'mobile_number').first();
    if (user) {
      return res.json({ ...user, role: 'user' });
    }

    // Check lawyers table
    user = await db('lawyers').where({ id: req.user.id }).select('id', 'name', 'username', 'email', 'registration_id', 'law_firm', 'speciality', 'address', 'zip_code', 'city', 'state', 'country', 'mobile_number').first();
    if (user) {
      return res.json({ ...user, role: 'lawyer' });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, username, address, zip_code, city, state, country, mobile_number } = req.body;

    // Check users table
    let updated = await db('users').where({ id: req.user.id }).update({
      name,
      username,
      address,
      zip_code,
      city,
      state,
      country,
      mobile_number,
    });

    if (updated) {
      return res.json({ message: 'Profile updated successfully' });
    }

    // Check lawyers table
    updated = await db('lawyers').where({ id: req.user.id }).update({
      name,
      username,
      address,
      zip_code,
      city,
      state,
      country,
      mobile_number,
    });

    if (updated) {
      return res.json({ message: 'Profile updated successfully' });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    // Check users table
    let deleted = await db('users').where({ id: req.user.id }).del();
    if (deleted) {
      return res.json({ message: 'Account deleted successfully' });
    }

    // Check lawyers table
    deleted = await db('lawyers').where({ id: req.user.id }).del();
    if (deleted) {
      return res.json({ message: 'Account deleted successfully' });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  deleteAccount,
};
