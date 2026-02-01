const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// Get exchange rate (mock - in production, use real API)
const getExchangeRate = () => {
  return 92600; // Mock BTC to USD rate
};

// Currency swap
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    const numericAmount = Number(amount);

    if (!fromCurrency || !toCurrency || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid swap details' });
    }

    const account = await Account.findOne({ userId: req.user._id, isPrimary: true });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (fromCurrency === 'USD' && toCurrency === 'BTC') {
      const exchangeRate = getExchangeRate();
      const btcAmount = numericAmount / exchangeRate;

      if (account.balance < numericAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      account.balance -= numericAmount;
      account.bitcoinBalance += btcAmount;

      const transaction = new Transaction({
        userId: req.user._id,
        accountId: account._id,
        type: 'currency_swap',
        amount: -numericAmount,
        description: `Swapped ${numericAmount} USD to ${btcAmount} BTC`,
        status: 'completed',
        balanceAfter: account.balance,
        metadata: {
          fromCurrency: 'USD',
          toCurrency: 'BTC',
          amount: numericAmount,
          convertedAmount: btcAmount,
          exchangeRate: exchangeRate,
        },
      });

      await Promise.all([transaction.save(), account.save()]);

      res.json({
        message: 'Currency swap successful',
        transaction,
        newBalance: account.balance,
        newBitcoinBalance: account.bitcoinBalance,
      });
    } else if (fromCurrency === 'BTC' && toCurrency === 'USD') {
      const exchangeRate = getExchangeRate();
      const usdAmount = numericAmount * exchangeRate;

      if (account.bitcoinBalance < numericAmount) {
        return res.status(400).json({ message: 'Insufficient Bitcoin balance' });
      }

      account.bitcoinBalance -= numericAmount;
      account.balance += usdAmount;

      const transaction = new Transaction({
        userId: req.user._id,
        accountId: account._id,
        type: 'currency_swap',
        amount: usdAmount,
        description: `Swapped ${numericAmount} BTC to ${usdAmount} USD`,
        status: 'completed',
        balanceAfter: account.balance,
        metadata: {
          fromCurrency: 'BTC',
          toCurrency: 'USD',
          amount: numericAmount,
          convertedAmount: usdAmount,
          exchangeRate: exchangeRate,
        },
      });

      await Promise.all([transaction.save(), account.save()]);

      res.json({
        message: 'Currency swap successful',
        transaction,
        newBalance: account.balance,
        newBitcoinBalance: account.bitcoinBalance,
      });
    } else {
      return res.status(400).json({ message: 'Unsupported currency pair' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get exchange rate
router.get('/rate', authMiddleware, async (req, res) => {
  try {
    const exchangeRate = getExchangeRate();
    res.json({ rate: exchangeRate, fromCurrency: 'BTC', toCurrency: 'USD' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
