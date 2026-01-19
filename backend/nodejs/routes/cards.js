const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Card = require('../models/Card');
const Account = require('../models/Account');

// Get all cards for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get card by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Apply for card
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { cardType, cardName } = req.body;

    if (!cardType || !['virtual', 'physical'].includes(cardType)) {
      return res.status(400).json({ message: 'Invalid card type' });
    }

    const account = await Account.findOne({ userId: req.user._id, isPrimary: true });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Generate card number (16 digits)
    const generateCardNumber = () => {
      let cardNumber = '4'; // Visa starts with 4
      for (let i = 0; i < 15; i++) {
        cardNumber += Math.floor(Math.random() * 10);
      }
      return cardNumber;
    };

    // Generate expiry date (3 years from now)
    const generateExpiryDate = () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 3);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${month}/${year}`;
    };

    // Generate CVV
    const generateCVV = () => {
      return String(Math.floor(100 + Math.random() * 900));
    };

    const card = new Card({
      userId: req.user._id,
      accountId: account._id,
      cardNumber: generateCardNumber(),
      cardType: cardType,
      cardName: cardName || `${req.user.firstName} ${req.user.lastName}`,
      expiryDate: generateExpiryDate(),
      cvv: generateCVV(),
      status: cardType === 'virtual' ? 'active' : 'pending',
    });

    await card.save();
    res.json({
      message: `${cardType === 'virtual' ? 'Virtual' : 'Physical'} card application submitted`,
      card,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update card status
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, spendingLimit, dailyLimit } = req.body;
    const card = await Card.findOne({ _id: req.params.id, userId: req.user._id });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    if (status) card.status = status;
    if (spendingLimit !== undefined) card.spendingLimit = spendingLimit;
    if (dailyLimit !== undefined) card.dailyLimit = dailyLimit;

    await card.save();
    res.json({ message: 'Card updated', card });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
