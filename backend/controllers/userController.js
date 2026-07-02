import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import History from '../models/History.js';
import HealthTip from '../models/HealthTip.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, address, city } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullName,
        dateOfBirth,
        gender,
        address,
        city,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    const user = await User.findById(req.user.userId).select('+password');

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    const recentSymptomChecks = await History.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const upcomingAppointments = await Appointment.find({
      userId: req.user.userId,
      status: 'confirmed',
      appointmentDate: { $gte: new Date() },
    })
      .populate('doctorId')
      .limit(3);

    const healthTips = await HealthTip.find({ isActive: true }).limit(5);

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        recentSymptomChecks,
        upcomingAppointments,
        healthTips,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profilePicture: req.file.path },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
