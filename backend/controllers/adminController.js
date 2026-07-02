import User from '../models/User.js';
import Disease from '../models/Disease.js';
import Doctor from '../models/Doctor.js';
import Symptom from '../models/Symptom.js';
import HealthTip from '../models/HealthTip.js';
import Appointment from '../models/Appointment.js';
import History from '../models/History.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDoctors = await Doctor.countDocuments();
    const totalDiseases = await Disease.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    const recentAppointments = await Appointment.find()
      .populate('userId')
      .populate('doctorId')
      .sort({ createdAt: -1 })
      .limit(10);

    // Most searched symptoms
    const mostSearchedSymptoms = await History.aggregate([
      { $unwind: '$selectedSymptoms' },
      { $group: { _id: '$selectedSymptoms', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Most common diseases
    const mostCommonDiseases = await History.aggregate([
      { $unwind: '$results' },
      { $group: { _id: '$results.diseaseName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalDiseases,
        totalAppointments,
        recentAppointments,
        mostSearchedSymptoms,
        mostCommonDiseases,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find({ role: 'user' })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ role: 'user' });

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHealthTip = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const healthTip = new HealthTip({
      title,
      description,
      category,
      priority,
    });

    await healthTip.save();

    res.status(201).json({
      success: true,
      message: 'Health tip created successfully',
      data: healthTip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllHealthTips = async (req, res) => {
  try {
    const healthTips = await HealthTip.find().sort({ priority: -1 });

    res.json({
      success: true,
      data: healthTips,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHealthTip = async (req, res) => {
  try {
    const { id } = req.params;

    const healthTip = await HealthTip.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!healthTip) {
      return res.status(404).json({ message: 'Health tip not found' });
    }

    res.json({
      success: true,
      message: 'Health tip updated successfully',
      data: healthTip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHealthTip = async (req, res) => {
  try {
    const { id } = req.params;

    await HealthTip.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Health tip deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
