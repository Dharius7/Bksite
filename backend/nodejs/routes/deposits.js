const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// Create deposit
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, method, currency = 'USD' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount' });
    }

    const account = await Account.findOne({ userId: req.user._id, isPrimary: true });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Create transaction
    const transaction = new Transaction({
      userId: req.user._id,
      accountId: account._id,
      type: 'deposit',
      amount: amount,
      currency: currency,
      description: `Deposit via ${method || 'bank transfer'}`,
      status: 'completed',
      balanceAfter: account.balance + amount,
      metadata: { method: method || 'bitcoin' },
    });

    // Update account balance
    account.balance += amount;

    await Promise.all([transaction.save(), account.save()]);

    res.json({
      message: 'Deposit successful',
      transaction,
      newBalance: account.balance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
