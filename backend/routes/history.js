import express from 'express';
import {
  getSymptomHistory,
  getHistoryById,
  deleteHistoryRecord,
  deleteAllHistory,
  exportHistoryAsPDF,
} from '../controllers/historyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getSymptomHistory);
router.get('/:id', protect, getHistoryById);
router.delete('/:id', protect, deleteHistoryRecord);
router.delete('/', protect, deleteAllHistory);
router.get('/export/pdf', protect, exportHistoryAsPDF);

export default router;
