import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET'];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseCorsOrigins = () => {
  const raw = process.env.CORS_ORIGIN || 'http://localhost:5173';
  return raw.split(',').map((origin) => origin.trim()).filter(Boolean);
};

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGO_URI,
  corsOrigins: parseCorsOrigins(),
  maxRequestsPerMinute: toNumber(process.env.MAX_REQUESTS_PER_MINUTE, 100),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE || '30d',
});
