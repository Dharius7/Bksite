const express = require('express');
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Card = require('../models/Card');
const Loan = require('../models/Loan');
const Investment = require('../models/Investment');
const SupportTicket = require('../models/SupportTicket');
const Activity = require('../models/Activity');
const UserOtp = require('../models/UserOtp');
const Grant = require('../models/Grant');
const TaxRefund = require('../models/TaxRefund');
const geoip = require('geoip-lite');
const { getJwtSecret } = require('../config/env');

const router = express.Router();

// Admin login (email-only)
router.post('/login', async (req, res) => {
  try {
    const { emailOrName, password } = req.body;
    if (!emailOrName || !password) {
      return res.status(400).json({ message: 'Please provide email/username and password' });
    }

    const identifier = String(emailOrName).trim();
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() },
      ],
    });
    if (!user) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, getJwtSecret(), {
      expiresIn: '7d',
    });

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const geo = ip && ip !== 'unknown' ? geoip.lookup(ip) : null;
    await Activity.create({
      userId: user._id,
      accountId: null,
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
      type: 'admin_login',
    });

    res.json({
      token,
      admin: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create admin (name + password)
router.post('/create-admin', adminAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const [firstNameRaw, ...rest] = String(name).trim().split(' ');
    const firstName = firstNameRaw || 'Admin';
    const lastName = rest.join(' ') || 'User';
    const slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
    const username = (slug || 'admin').slice(0, 32);

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Admin email already exists' });
    }

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      username,
      phone: '0000000000',
      password,
      dateOfBirth: new Date('1990-01-01'),
      address: {
        street: 'Admin Street',
        city: 'Nassau',
        state: 'New Providence',
        zipCode: '00000',
        country: 'Bahamas',
      },
      role: 'admin',
      kycStatus: 'approved',
      accountStatus: 'active',
      isVerified: true,
    });

    await user.save();

    res.json({
      admin: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        username: user.username,
      },
      message: 'Admin created successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Activities
router.get('/activities', adminAuth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const activities = await Activity.find()
      .populate('userId', 'firstName lastName email accountId')
      .populate('accountId', 'accountNumber')
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/activities/:id', adminAuth, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin profile
router.get('/me', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'Admin not found' });
    res.json({ admin: user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/me', adminAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Admin not found' });

    if (email && email.toLowerCase() !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (existing) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email.toLowerCase();
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) user.password = password;

    await user.save();

    const admin = await User.findById(user._id).select('-password');
    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Overview
router.get('/overview', adminAuth, async (req, res) => {
  try {
    const [
      users,
      accounts,
      transactions,
      cards,
      loans,
      investments,
      tickets,
      otpCount,
    ] = await Promise.all([
      User.countDocuments(),
      Account.countDocuments(),
      Transaction.countDocuments(),
      Card.countDocuments(),
      Loan.countDocuments(),
      Investment.countDocuments(),
      SupportTicket.countDocuments(),
      UserOtp.countDocuments({ expiresAt: { $gt: new Date() } }),
    ]);

    const transferCount = await Transaction.countDocuments({ type: 'transfer' });
    const depositCount = await Transaction.countDocuments({ type: 'deposit' });

    res.json({
      users,
      accounts,
      transactions,
      cards,
      loans,
      investments,
      tickets,
      otpCount,
      transferCount,
      depositCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status } = req.query;
    const query = {};
    if (role) query.role = role;
    if (status) query.accountStatus = status;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const otpRecords = await UserOtp.find({
      userId: { $in: users.map((u) => u._id) },
      expiresAt: { $gt: new Date() },
    });
    const otpMap = otpRecords.reduce((acc, item) => {
      acc[item.userId.toString()] = item.code;
      return acc;
    }, {});

    const total = await User.countDocuments(query);
    res.json({
      users: users.map((user) => ({
        ...user.toObject(),
        otpCode: otpMap[user._id.toString()] || null,
      })),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/users/:id', adminAuth, async (req, res) => {
  try {
    const { kycStatus, accountStatus, role, firstName, lastName, email, phone } = req.body;
    const updates = {};
    if (kycStatus) updates.kycStatus = kycStatus;
    if (accountStatus) updates.accountStatus = accountStatus;
    if (role) updates.role = role;
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email.toLowerCase();
    if (phone) updates.phone = phone;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      const result = await User.collection.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
    }
    const userIdQuery = user?._id || id;
    await Promise.all([
      Account.deleteMany({ userId: userIdQuery }),
      Transaction.deleteMany({ userId: userIdQuery }),
      Card.deleteMany({ userId: userIdQuery }),
      Loan.deleteMany({ userId: userIdQuery }),
      Investment.deleteMany({ userId: userIdQuery }),
      SupportTicket.deleteMany({ userId: userIdQuery }),
      Activity.deleteMany({ userId: userIdQuery }),
      UserOtp.deleteMany({ userId: userIdQuery }),
      Grant.deleteMany({ userId: userIdQuery }),
      TaxRefund.deleteMany({ userId: userIdQuery }),
    ]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accounts
router.get('/accounts', adminAuth, async (req, res) => {
  try {
    const accounts = await Account.find()
      .populate('userId', 'firstName lastName email accountId')
      .sort({ createdAt: -1 });
    res.json({ accounts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/accounts/:id', adminAuth, async (req, res) => {
  try {
    const { balance, bitcoinBalance, status, accountType, currency, transferMessage } = req.body;
    const updates = {};
    if (typeof balance === 'number') updates.balance = balance;
    if (typeof bitcoinBalance === 'number') updates.bitcoinBalance = bitcoinBalance;
    if (status) updates.status = status;
    if (accountType) updates.accountType = accountType;
    if (currency) updates.currency = currency;
    if (typeof transferMessage === 'string') updates.transferMessage = transferMessage;

    const account = await Account.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json({ account });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create account
router.post('/accounts', adminAuth, async (req, res) => {
  try {
    const { userId, accountType, balance = 0, currency = 'USD', bitcoinBalance = 0, status = 'active', accountNumber } = req.body;
    if (!userId || !accountType) {
      return res.status(400).json({ message: 'userId and accountType are required' });
    }

    const number = accountNumber || Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const account = new Account({
      userId,
      accountNumber: number,
      accountType,
      balance,
      currency,
      bitcoinBalance,
      status,
      isPrimary: false,
    });

    await account.save();
    res.json({ account });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create user + account (admin)
router.post('/accounts/create-user', adminAuth, async (req, res) => {
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
      initialDeposit = 0,
      currency = 'USD',
      status = 'active',
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
      accountStatus: status === 'active' ? 'active' : 'inactive',
    });

    await user.save();

    const account = new Account({
      userId: user._id,
      accountNumber: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      accountType,
      balance: Number(initialDeposit || 0),
      currency,
      bitcoinBalance: 0,
      isPrimary: true,
      status,
    });

    await account.save();

    if (Number(initialDeposit || 0) > 0) {
      const transaction = new Transaction({
        userId: user._id,
        accountId: account._id,
        type: 'deposit',
        amount: Number(initialDeposit),
        currency,
        description: 'Initial deposit (admin)',
        status: 'completed',
        balanceAfter: account.balance,
        metadata: { method: 'admin' },
      });
      await transaction.save();
    }

    res.json({ user, account });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete account
router.delete('/accounts/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findByIdAndDelete(id);
    if (!account) {
      const result = await Account.collection.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Account not found' });
      }
    }
    const accountIdQuery = account?._id || id;
    await Promise.all([
      Transaction.deleteMany({ accountId: accountIdQuery }),
      Activity.deleteMany({ accountId: accountIdQuery }),
    ]);
    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin deposit to account
router.post('/accounts/:id/deposit', adminAuth, async (req, res) => {
  try {
    const {
      amount,
      currency = 'USD',
      description = 'Admin deposit',
      date,
      depositorName,
      depositType = 'bank',
      accountNumber,
    } = req.body;
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    if (!depositorName || String(depositorName).trim().length < 2) {
      return res.status(400).json({ message: 'Depositor name is required' });
    }
    if (!['bank', 'check'].includes(depositType)) {
      return res.status(400).json({ message: 'Invalid deposit type' });
    }
    if (depositType === 'bank' && (!accountNumber || String(accountNumber).trim().length < 4)) {
      return res.status(400).json({ message: 'Account number is required for bank deposits' });
    }

    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });

    const createdAt = date ? new Date(date) : undefined;

    const transaction = new Transaction({
      userId: account.userId,
      accountId: account._id,
      type: 'deposit',
      amount: numericAmount,
      currency,
      description,
      status: 'completed',
      balanceAfter: account.balance + numericAmount,
      metadata: {
        method: 'admin',
        depositorName: String(depositorName).trim(),
        depositType,
        ...(depositType === 'bank' ? { accountNumber: String(accountNumber).trim() } : {}),
      },
      ...(createdAt ? { createdAt } : {}),
    });

    account.balance += numericAmount;
    await Promise.all([transaction.save(), account.save()]);
    res.json({ transaction, newBalance: account.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin transfer from account
router.post('/accounts/:id/transfer', adminAuth, async (req, res) => {
  try {
    const { toAccount, amount, description = 'Admin transfer', method = 'wire', date, recipientName } = req.body;
    if (!toAccount || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer details' });
    }

    const fromAccount = await Account.findById(req.params.id);
    if (!fromAccount) return res.status(404).json({ message: 'Account not found' });

    if (fromAccount.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const createdAt = date ? new Date(date) : undefined;

    const debitTransaction = new Transaction({
      userId: fromAccount.userId,
      accountId: fromAccount._id,
      type: 'transfer',
      amount: -amount,
      description: description || `Transfer to ${toAccount}`,
      status: 'completed',
      toAccount,
      fromAccount: fromAccount.accountNumber,
      balanceAfter: fromAccount.balance - amount,
      metadata: { method, ...(recipientName ? { recipientName: String(recipientName).trim() } : {}) },
      ...(createdAt ? { createdAt } : {}),
    });

    fromAccount.balance -= amount;
    const toAccountDoc = await Account.findOne({ accountNumber: toAccount });
    if (toAccountDoc) {
      const creditTransaction = new Transaction({
        userId: toAccountDoc.userId,
        accountId: toAccountDoc._id,
        type: 'transfer',
        amount,
        description: description || `Transfer from ${fromAccount.accountNumber}`,
        status: 'completed',
        fromAccount: fromAccount.accountNumber,
        toAccount,
        balanceAfter: toAccountDoc.balance + amount,
        metadata: { method, ...(recipientName ? { recipientName: String(recipientName).trim() } : {}) },
        ...(createdAt ? { createdAt } : {}),
      });
      toAccountDoc.balance += amount;
      await Promise.all([
        debitTransaction.save(),
        creditTransaction.save(),
        fromAccount.save(),
        toAccountDoc.save(),
      ]);
    } else {
      await Promise.all([debitTransaction.save(), fromAccount.save()]);
    }

    res.json({ message: 'Transfer successful', transaction: debitTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin debit from account
router.post('/accounts/:id/debit', adminAuth, async (req, res) => {
  try {
    const { amount, currency = 'USD', description = 'Admin debit', date } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });

    if (account.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const createdAt = date ? new Date(date) : undefined;

    const transaction = new Transaction({
      userId: account.userId,
      accountId: account._id,
      type: 'debit',
      amount: -amount,
      currency,
      description,
      status: 'completed',
      balanceAfter: account.balance - amount,
      metadata: { method: 'admin' },
      ...(createdAt ? { createdAt } : {}),
    });

    account.balance -= amount;
    await Promise.all([transaction.save(), account.save()]);
    res.json({ transaction, newBalance: account.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin received (credit) to account
router.post('/accounts/:id/receive', adminAuth, async (req, res) => {
  try {
    const {
      senderAccount,
      senderName,
      amount,
      description = 'Received transfer',
      date,
    } = req.body;

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    if (!senderName || String(senderName).trim().length < 2) {
      return res.status(400).json({ message: 'Sender name is required' });
    }
    if (!senderAccount || String(senderAccount).trim().length < 1) {
      return res.status(400).json({ message: 'Sender account is required' });
    }

    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });

    const createdAt = date ? new Date(date) : undefined;

    const transaction = new Transaction({
      userId: account.userId,
      accountId: account._id,
      type: 'received',
      amount: numericAmount,
      currency: account.currency || 'USD',
      description,
      status: 'completed',
      balanceAfter: account.balance + numericAmount,
      metadata: {
        method: 'received',
        senderName: String(senderName).trim(),
        senderAccount: String(senderAccount).trim(),
      },
      ...(createdAt ? { createdAt } : {}),
    });

    account.balance += numericAmount;
    await Promise.all([transaction.save(), account.save()]);
    res.json({ transaction, newBalance: account.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Transactions
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const { type, status } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    const transactions = await Transaction.find(query)
      .populate('userId', 'firstName lastName email accountId')
      .populate('accountId', 'accountNumber')
      .sort({ createdAt: -1 });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/transactions/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cards
router.get('/cards', adminAuth, async (req, res) => {
  try {
    const cards = await Card.find()
      .populate('userId', 'firstName lastName email accountId')
      .sort({ createdAt: -1 });
    res.json({ cards });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/cards/:id', adminAuth, async (req, res) => {
  try {
    const { status, spendingLimit, dailyLimit } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (typeof spendingLimit === 'number') updates.spendingLimit = spendingLimit;
    if (typeof dailyLimit === 'number') updates.dailyLimit = dailyLimit;
    const card = await Card.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json({ card });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/cards/:id', adminAuth, async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json({ message: 'Card deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Loans
router.get('/loans', adminAuth, async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('userId', 'firstName lastName email accountId')
      .sort({ createdAt: -1 });
    res.json({ loans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/loans/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const updates = { status };
    if (status === 'approved') updates.approvedAt = new Date();
    if (status === 'active') updates.disbursedAt = new Date();
    const loan = await Loan.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json({ loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/loans/:id', adminAuth, async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json({ message: 'Loan deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Investments
router.get('/investments', adminAuth, async (req, res) => {
  try {
    const investments = await Investment.find()
      .populate('userId', 'firstName lastName email accountId')
      .sort({ createdAt: -1 });
    res.json({ investments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/investments/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const investment = await Investment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!investment) return res.status(404).json({ message: 'Investment not found' });
    res.json({ investment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/investments/:id', adminAuth, async (req, res) => {
  try {
    const investment = await Investment.findByIdAndDelete(req.params.id);
    if (!investment) return res.status(404).json({ message: 'Investment not found' });
    res.json({ message: 'Investment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Support tickets
router.get('/support-tickets', adminAuth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate('userId', 'firstName lastName email accountId')
      .sort({ createdAt: -1 });
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/support-tickets/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/support-tickets/:id', adminAuth, async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
