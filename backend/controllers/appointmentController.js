import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { sendAppointmentConfirmation } from '../utils/email.js';
import { createNotification } from '../utils/createNotification.js';

const isPastDate = (dateStr) => {
  const selected = new Date(dateStr);
  selected.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today;
};

export const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      timeSlot,
      symptoms,
      notes,
      reason,
      consultationType,
    } = req.body;

    const slot = timeSlot || appointmentTime;

    if (!doctorId || !appointmentDate || !slot) {
      return res.status(400).json({ success: false, message: 'Doctor, date, and time slot are required' });
    }

    if (!patientName?.trim() || !patientEmail?.trim() || !patientPhone?.trim()) {
      return res.status(400).json({ success: false, message: 'Patient name, email, and phone are required' });
    }

    if (isPastDate(appointmentDate)) {
      return res.status(400).json({ success: false, message: 'Cannot book appointments in the past' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const duplicate = await Appointment.findOne({
      userId: req.user.userId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime: slot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'You already have an appointment with this doctor at the selected date and time',
      });
    }

    const user = await User.findById(req.user.userId);

    const appointment = new Appointment({
      userId: req.user.userId,
      doctorId,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim().toLowerCase(),
      patientPhone: patientPhone.trim(),
      appointmentDate,
      appointmentTime: slot,
      symptoms: symptoms || '',
      notes: notes || '',
      reason: reason || symptoms || '',
      consultationType: consultationType || 'in-person',
      status: 'pending',
      paymentStatus: 'pending',
    });

    await appointment.save();
    await appointment.populate('doctorId');

    await createNotification(req.user.userId, {
      title: 'Appointment Booked',
      message: `Your appointment with ${doctor.name} on ${new Date(appointmentDate).toLocaleDateString()} is pending confirmation.`,
      type: 'appointment',
      link: '/appointments',
    });

    await sendAppointmentConfirmation(user.email, {
      doctorName: doctor.name,
      date: appointmentDate,
      time: slot,
      location: doctor.clinicAddress,
    }).catch((err) => console.error('Email failed:', err));

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = { userId: req.user.userId };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('doctorId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appointmentDate: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId')
      .populate('userId', 'fullName email mobileNumber');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (
      appointment.userId._id.toString() !== req.user.userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const {
      appointmentDate,
      appointmentTime,
      timeSlot,
      symptoms,
      notes,
      reason,
      status,
      prescription,
      meetLink,
      paymentStatus,
    } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const isOwner = appointment.userId.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (appointmentDate) {
      if (isPastDate(appointmentDate)) {
        return res.status(400).json({ success: false, message: 'Cannot reschedule to a past date' });
      }
      appointment.appointmentDate = appointmentDate;
    }

    const slot = timeSlot || appointmentTime;
    if (slot) appointment.appointmentTime = slot;
    if (symptoms !== undefined) appointment.symptoms = symptoms;
    if (notes !== undefined) appointment.notes = notes;
    if (reason !== undefined) appointment.reason = reason;

    if (isAdmin) {
      if (status) {
        appointment.status = status;
        if (status === 'completed') appointment.completedAt = new Date();
        if (status === 'cancelled') appointment.cancelledAt = new Date();
      }
      if (prescription) appointment.prescription = prescription;
      if (meetLink) appointment.meetLink = meetLink;
      if (paymentStatus) appointment.paymentStatus = paymentStatus;
    }

    await appointment.save();
    await appointment.populate('doctorId');

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (
      appointment.userId.toString() !== req.user.userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed appointment' });
    }

    appointment.status = 'cancelled';
    appointment.cancelReason = cancelReason || 'Cancelled by user';
    appointment.cancelledAt = new Date();

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const { status, doctorId, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (doctorId) query.doctorId = doctorId;

    const appointments = await Appointment.find(query)
      .populate('userId', 'fullName email mobileNumber')
      .populate('doctorId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    if (status === 'completed') appointment.completedAt = new Date();
    if (status === 'cancelled') {
      appointment.cancelledAt = new Date();
      appointment.cancelReason = cancelReason || 'Cancelled by admin';
    }

    await appointment.save();
    await appointment.populate(['userId', 'doctorId']);

    await createNotification(appointment.userId, {
      title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your appointment with ${appointment.doctorId?.name} has been ${status}.`,
      type: 'appointment',
      link: '/appointments',
    });

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.query;

    const query = { doctorId };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('userId', 'fullName email mobileNumber')
      .sort({ appointmentDate: -1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
