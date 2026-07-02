import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendPasswordResetEmail } from '../utils/email.js';
import { createNotification } from '../utils/createNotification.js';
import crypto from 'crypto';

export const register = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password } = req.body;

    console.log('[REGISTER] Incoming request:', { fullName, email, mobileNumber });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.error('[REGISTER] Duplicate email:', email);
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const existingPhone = await User.findOne({ mobileNumber });
    if (existingPhone) {
      console.error('[REGISTER] Duplicate phone:', mobileNumber);
      return res.status(409).json({ success: false, message: 'Phone number already registered' });
    }

    const user = new User({
      fullName,
      email,
      mobileNumber,
      password,
    });

    await user.save();
    console.log('[REGISTER] User saved:', user._id);

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await user.save();

    await createNotification(user._id, {
      title: 'Welcome to SymptomChecker!',
      message: 'Your account has been created. Start checking your symptoms now.',
      type: 'success',
      link: '/symptom-checker',
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('[REGISTER] Error:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      const message = field === 'mobileNumber'
        ? 'Phone number already registered'
        : 'Email already exists';
      return res.status(409).json({ success: false, message });
    }

    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)[0]?.message || 'Validation failed';
      return res.status(400).json({ success: false, message });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed. Please try again.',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + (rememberMe ? 90 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000)),
    });

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('[LOGIN] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    await User.updateOne(
      { _id: req.user.userId },
      { $pull: { refreshTokens: { token: refreshToken } } }
    );

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.some((rt) => rt.token === refreshToken)) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    console.error('[REFRESH TOKEN] Error:', error);
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = new Date(Date.now() + 3600000);
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.json({
      success: true,
      message: 'Password reset link sent to email',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(admin._id, 'admin');
    const refreshToken = generateRefreshToken(admin._id);

    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      message: 'Admin logged in successfully',
      data: {
        admin: { _id: admin._id, email: admin.email, name: admin.name },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
