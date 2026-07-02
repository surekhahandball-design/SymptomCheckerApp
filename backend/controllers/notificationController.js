import Notification from '../models/Notification.js';
import { ensureWelcomeNotifications } from '../utils/createNotification.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    await ensureWelcomeNotifications(userId);

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.json({
      success: true,
      data: { notifications, unreadCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const unreadCount = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false,
    });

    res.json({ success: true, data: { notification, unreadCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userId, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, data: { unreadCount: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
