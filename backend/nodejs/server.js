const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { getCorsOrigins, isProd, requireEnv } = require('./config/env');

dotenv.config();

if (isProd) {
  requireEnv('JWT_SECRET');
  requireEnv('MONGODB_URI');
  requireEnv('CORS_ORIGIN');
}

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());

const corsOrigins = getCorsOrigins();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (corsOrigins.length === 0) return callback(null, true);
      if (corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !isProd,
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Orine Credit Bank API is running' });
});

// Auth routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/admin', authLimiter, require('./routes/admin'));

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
app.use('/api/support', require('./routes/support'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const message = isProd ? 'Internal server error' : 'Something went wrong!';
  const payload = { message };
  if (!isProd && err?.message) {
    payload.error = err.message;
  }
  res.status(500).json(payload);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
