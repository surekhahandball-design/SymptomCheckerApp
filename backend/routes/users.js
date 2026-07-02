import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getDashboard,
  uploadProfilePicture,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/dashboard', protect, getDashboard);
router.post('/upload-profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

export default router;
