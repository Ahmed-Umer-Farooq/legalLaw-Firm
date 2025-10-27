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

const register = async (req, res) => {
  try {
    const { name, email, password, role, registration_id, law_firm, speciality, address, zip_code } = req.body;

    const validation = validateRegistration({ name, email, password, role, registration_id });
    if (!validation.isValid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const [userId] = await db('users').insert({
      name,
      email,
      password: hashedPassword,
      role,
      registration_id: role === 'lawyer' ? registration_id : null,
      law_firm,
      speciality,
      address,
      zip_code,
      email_verification_code: verificationCode,
    });

    // await mockSendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'Registration successful. Please check your email for verification code.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, registration_id, role } = req.body;

    const validation = validateLogin({ email, password, registration_id, role });
    if (!validation.isValid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    let user;
    if (role === 'lawyer' && registration_id) {
      user = await db('users').where({ email, registration_id }).first();
    } else {
      user = await db('users').where({ email }).first();
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

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await db('users').where({ email, email_verification_code: code }).first();
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    await db('users').where({ id: user.id }).update({
      email_verified: true,
      email_verification_code: null,
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await db('users').where({ id: user.id }).update({
      reset_token: resetToken,
      reset_token_expiry: resetTokenExpiry,
    });

    await mockSendResetPasswordEmail(email, resetToken);

    res.json({ message: 'Password reset link sent to your email' });
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

    const user = await db('users')
      .where({ reset_token: token })
      .andWhere('reset_token_expiry', '>', new Date())
      .first();

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db('users').where({ id: user.id }).update({
      password: hashedPassword,
      reset_token: null,
      reset_token_expiry: null,
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await db('users').where({ id: req.user.id }).select('id', 'name', 'email', 'role', 'registration_id', 'law_firm', 'speciality', 'address', 'zip_code').first();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, address, zip_code } = req.body;

    await db('users').where({ id: req.user.id }).update({
      name,
      address,
      zip_code,
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await db('users').where({ id: req.user.id }).del();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  deleteAccount,
};
