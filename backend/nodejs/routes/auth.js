const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Activity = require('../models/Activity');
<<<<<<< HEAD
=======
const UserOtp = require('../models/UserOtp');
>>>>>>> b2ccfa7 (First Update commit)
const geoip = require('geoip-lite');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      ssn,
      password,
      dateOfBirth,
      address,
      accountType,
      initialDeposit,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !dateOfBirth) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!address?.street || !address?.city || !address?.state || !address?.zipCode) {
      return res.status(400).json({ message: 'Address is required' });
    }

    if (!accountType) {
      return res.status(400).json({ message: 'Account type is required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      ssn,
      password,
      dateOfBirth,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country || 'Bahamas',
      },
      role: 'user',
    });

    await user.save();

    const account = new Account({
      userId: user._id,
      accountNumber: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      accountType,
      balance: Number(initialDeposit || 0),
      currency: 'USD',
      bitcoinBalance: 0,
      isPrimary: true,
      status: 'active',
    });

    await account.save();

    if (Number(initialDeposit || 0) > 0) {
      const transaction = new Transaction({
        userId: user._id,
        accountId: account._id,
        type: 'deposit',
        amount: Number(initialDeposit),
        currency: 'USD',
        description: 'Initial deposit',
        status: 'completed',
        balanceAfter: account.balance,
        metadata: { method: 'initial' },
      });
      await transaction.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

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
      account,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login (DEV mode password bypass)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 🔒 Password bypass in DEV only
    if (process.env.NODE_ENV === 'production') {
      if (!password) {
        return res.status(400).json({ message: 'Please provide password' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    if (user.accountStatus !== 'active') {
      return res.status(403).json({ message: 'Account is not active' });
    }

<<<<<<< HEAD
    // Create JWT token
=======
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await UserOtp.deleteMany({ userId: user._id });
    await UserOtp.create({ userId: user._id, code: otpCode, expiresAt });

    const otpToken = jwt.sign(
      { userId: user._id, email: user.email, purpose: 'user_otp' },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '10m' }
    );

    res.json({
      otpRequired: true,
      otpToken,
      otpExpiresAt: expiresAt,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { otp, otpToken } = req.body;
    if (!otp || !otpToken) {
      return res.status(400).json({ message: 'OTP and token are required' });
    }

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET || 'dev-secret');
    if (!decoded || decoded.purpose !== 'user_otp') {
      return res.status(401).json({ message: 'Invalid OTP session' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const otpRecord = await UserOtp.findOne({ userId: user._id, code: String(otp).trim() });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    await UserOtp.deleteMany({ userId: user._id });

>>>>>>> b2ccfa7 (First Update commit)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

<<<<<<< HEAD
    // Get primary account
=======
>>>>>>> b2ccfa7 (First Update commit)
    const account = await Account.findOne({ userId: user._id, isPrimary: true });

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const geo = ip && ip !== 'unknown' ? geoip.lookup(ip) : null;
    await Activity.create({
      userId: user._id,
      accountId: account?._id,
      ipAddress: ip,
      location: geo
        ? {
            city: geo.city,
            region: geo.region,
            country: geo.country,
            timezone: geo.timezone,
          }
        : {},
      userAgent: req.headers['user-agent'] || '',
      type: 'login',
    });

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
    console.error('OTP verify error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    const { otpToken } = req.body;
    if (!otpToken) {
      return res.status(400).json({ message: 'OTP token is required' });
    }

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET || 'dev-secret');
    if (!decoded || decoded.purpose !== 'user_otp') {
      return res.status(401).json({ message: 'Invalid OTP session' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.accountStatus !== 'active') {
      return res.status(403).json({ message: 'Account is not active' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await UserOtp.deleteMany({ userId: user._id });
    await UserOtp.create({ userId: user._id, code: otpCode, expiresAt });

    const newOtpToken = jwt.sign(
      { userId: user._id, email: user.email, purpose: 'user_otp' },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '10m' }
    );

    res.json({
      otpRequired: true,
      otpToken: newOtpToken,
      otpExpiresAt: expiresAt,
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
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
