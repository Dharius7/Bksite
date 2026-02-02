const isProd = process.env.NODE_ENV === 'production';

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value && isProd) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

const getJwtSecret = () => {
  const value = process.env.JWT_SECRET;
  if (!value && isProd) {
    throw new Error('Missing required env var: JWT_SECRET');
  }
  return value || 'dev-secret';
};

const getMongoUri = () => {
  const value = process.env.MONGODB_URI;
  if (!value && isProd) {
    throw new Error('Missing required env var: MONGODB_URI');
  }
  return value || 'mongodb://localhost:27017/coral-credit-bank';
};

const getCorsOrigins = () => {
  const raw = process.env.CORS_ORIGIN || '';
  if (!raw) return [];
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
};

module.exports = {
  isProd,
  requireEnv,
  getJwtSecret,
  getMongoUri,
  getCorsOrigins,
};
