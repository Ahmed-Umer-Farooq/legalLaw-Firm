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

const registerLawyer = async (req, res) => {
  try {
    const { name, username, email, password, registration_id, law_firm, speciality, address, zip_code, city, state, country, mobile_number } = req.body;

    const validation = validateRegistration({ name, email, password, role: 'lawyer', registration_id });
    if (!validation.isValid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    const existingLawyer = await db('lawyers').where({ email }).first();
    if (existingLawyer) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    await db('lawyers').insert({
      name,
      username,
      email,
      password: hashedPassword,
      registration_id,
      law_firm,
      speciality,
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

const loginLawyer = async (req, res) => {
  try {
    const { email, password, registration_id } = req.body;

    const validation = validateLogin({ email, password, registration_id, role: 'lawyer' });
    if (!validation.isValid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    let lawyer;
    if (registration_id) {
      lawyer = await db('lawyers').where({ email, registration_id }).first();
    } else {
      lawyer = await db('lawyers').where({ email }).first();
    }

    if (!lawyer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!lawyer.email_verified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    const isPasswordValid = await bcrypt.compare(password, lawyer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(lawyer);

    res.json({ token, user: { id: lawyer.id, name: lawyer.name, email: lawyer.email, role: 'lawyer' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const lawyer = await db('lawyers').where({ id: req.user.id }).select('id', 'name', 'username', 'email', 'registration_id', 'law_firm', 'speciality', 'address', 'zip_code', 'city', 'state', 'country', 'mobile_number').first();
    res.json(lawyer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, username, address, zip_code, city, state, country, mobile_number } = req.body;

    await db('lawyers').where({ id: req.user.id }).update({
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
    await db('lawyers').where({ id: req.user.id }).del();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerLawyer,
  loginLawyer,
  getProfile,
  updateProfile,
  deleteAccount,
};
