import express from 'express';
import {
  getAllDiseases,
  getDiseaseById,
  createDisease,
  updateDisease,
  deleteDisease,
  searchDiseases,
} from '../controllers/diseaseController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateDisease, validate } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllDiseases);
router.get('/search', searchDiseases);
router.get('/:id', getDiseaseById);

// Admin routes
router.post('/', protect, adminOnly, validateDisease, validate, createDisease);
router.put('/:id', protect, adminOnly, updateDisease);
router.delete('/:id', protect, adminOnly, deleteDisease);

export default router;
