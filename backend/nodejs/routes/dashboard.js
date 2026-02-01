const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Loan = require('../models/Loan');
const Investment = require('../models/Investment');

// Get dashboard summary
router.get('/', authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user._id, isPrimary: true });
    
    // Get transaction statistics
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyDeposits = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'deposit',
          status: 'completed',
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: { $in: ['debit', 'transfer'] },
          amount: { $lt: 0 },
          status: 'completed',
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $abs: '$amount' } },
        },
      },
    ]);

    const totalVolume = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $abs: '$amount' } },
        },
      },
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('accountId', 'accountNumber accountType');

    // Get pending transactions
    const pendingTransactions = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          status: 'pending',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $abs: '$amount' } },
        },
      },
    ]);

    res.json({
      account: account || null,
      userStatus: req.user?.accountStatus || 'active',
      stats: {
        monthlyDeposits: monthlyDeposits[0]?.total || 0,
        monthlyExpenses: monthlyExpenses[0]?.total || 0,
        totalVolume: totalVolume[0]?.total || 0,
        pendingTransactions: pendingTransactions[0]?.total || 0,
      },
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
