const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.accountStatus !== 'active') {
      return res.status(403).json({ message: 'Account is not active' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Get user's primary account
    const account = await Account.findOne({ userId: user._id, isPrimary: true });

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountId: user.accountId,
        kycStatus: user.kycStatus,
        accountStatus: user.accountStatus,
        role: user.role,
      },
      account: account || null,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const authMiddleware = require('../middleware/auth');

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const account = await Account.findOne({ userId: user._id, isPrimary: true });
    
    res.json({
      user,
      account: account || null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
