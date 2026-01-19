const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Coral Credit Bank API is running' });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Protected routes
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/transfers', require('./routes/transfers'));
app.use('/api/deposits', require('./routes/deposits'));
app.use('/api/cards', require('./routes/cards'));
app.use('/api/currency-swap', require('./routes/currencySwap'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/investments', require('./routes/investments'));
app.use('/api/tax-refund', require('./routes/taxRefund'));
app.use('/api/grants', require('./routes/grants'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/user', require('./routes/user'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
