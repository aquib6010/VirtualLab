/**
 * Auth Routes — Register & Login with JWT.
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  });
};

// ─── POST /api/auth/register ────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Create user
    const user = new User({
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      displayName,
    });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully.',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// ─── POST /api/auth/login ───────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful.',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ─── GET /api/auth/me ───────────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
