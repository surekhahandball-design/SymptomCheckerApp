import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    env.jwtSecret,
    { expiresIn: env.jwtExpire }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    env.refreshTokenSecret,
    { expiresIn: env.refreshTokenExpire }
  );
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error) {
    console.error('[JWT] Access token error:', error.message);
    throw new Error('Invalid access token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, env.refreshTokenSecret);
  } catch (error) {
    console.error('[JWT] Refresh token error:', error.message);
    throw new Error('Invalid refresh token');
  }
};
