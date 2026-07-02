import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  createHealthTip,
  getAllHealthTips,
  updateHealthTip,
  deleteHealthTip,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

router.get('/health-tips', protect, adminOnly, getAllHealthTips);
router.post('/health-tips', protect, adminOnly, createHealthTip);
router.put('/health-tips/:id', protect, adminOnly, updateHealthTip);
router.delete('/health-tips/:id', protect, adminOnly, deleteHealthTip);

export default router;
