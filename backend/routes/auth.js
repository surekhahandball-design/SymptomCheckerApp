import express from 'express';
import {
  register,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  adminLogin,
} from '../controllers/authController.js';
import { validateRegister, validateLogin, validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, validate, register);
router.post('/login', validateLogin, validate, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/admin/login', adminLogin);

export default router;
