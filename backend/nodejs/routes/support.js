const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const SupportTicket = require('../models/SupportTicket');

// Create support ticket
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, priority, description } = req.body;
    const safeTitle = String(title || '').trim();
    const safeDescription = String(description || '').trim();

    if (!safeTitle || !safeDescription) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    if (safeTitle.length < 5 || safeDescription.length < 10) {
      return res.status(400).json({ message: 'Please provide more detail in the ticket.' });
    }

    const ticket = new SupportTicket({
      userId: req.user._id,
      title: safeTitle,
      priority: priority || 'low',
      description: safeDescription,
    });

    await ticket.save();

    res.json({ message: 'Support ticket submitted', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user tickets
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
