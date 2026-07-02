import express from 'express';
import {
  bookAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getDoctorAppointments,
} from '../controllers/appointmentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, bookAppointment);
router.get('/user/appointments', protect, getUserAppointments);
router.get('/user', protect, getUserAppointments);
router.get('/doctor/:doctorId', protect, adminOnly, getDoctorAppointments);
router.get('/', protect, adminOnly, getAllAppointments);
router.patch('/:id/status', protect, adminOnly, updateAppointmentStatus);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, cancelAppointment);

export default router;
