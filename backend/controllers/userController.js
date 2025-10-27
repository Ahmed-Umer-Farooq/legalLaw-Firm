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

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, address, zip_code, city, state, country, mobile_number } = req.body;

    const validation = validateRegistration({ name, email, password, role: 'user' });
    if (!validation.isValid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    await db('users').insert({
      name,
      username,
      email,
      password: hashedPassword,
      address,
      zip_code,
      city,
      state,
      country,
      mobile_number,
      email_verification_code: verificationCode,
    });

    await mockSendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'Registration successful. Please check your email for verification code.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = validateLogin({ email, password, role: 'user' });
    if (!validation.isValid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    const user = await db('users').where({ email }).first();

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

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: 'user' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await db('users').where({ id: req.user.id }).select('id', 'name', 'username', 'email', 'address', 'zip_code', 'city', 'state', 'country', 'mobile_number').first();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, username, address, zip_code, city, state, country, mobile_number } = req.body;

    await db('users').where({ id: req.user.id }).update({
      name,
      username,
      address,
      zip_code,
      city,
      state,
      country,
      mobile_number,
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
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteAccount,
};
