import express from 'express';
import {
  getAllSymptoms,
  getSymptomsGroupedByCategory,
  checkSymptoms,
  createSymptom,
  updateSymptom,
  deleteSymptom,
} from '../controllers/symptomController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllSymptoms);
router.get('/grouped', getSymptomsGroupedByCategory);
router.post('/check', protect, checkSymptoms);

// Admin routes
router.post('/', protect, adminOnly, createSymptom);
router.put('/:id', protect, adminOnly, updateSymptom);
router.delete('/:id', protect, adminOnly, deleteSymptom);

export default router;
