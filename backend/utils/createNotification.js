import Notification from '../models/Notification.js';

export const createNotification = async (userId, { title, message, type = 'info', link = null }) => {
  try {
    return await Notification.create({ userId, title, message, type, link });
  } catch (error) {
    console.error('[NOTIFICATION] Failed to create:', error.message);
    return null;
  }
};

export const ensureWelcomeNotifications = async (userId) => {
  const count = await Notification.countDocuments({ userId });
  if (count > 0) return;

  await Notification.insertMany([
    {
      userId,
      title: 'Welcome to SymptomChecker!',
      message: 'Your account is ready. Start your first symptom check to get health insights.',
      type: 'success',
      link: '/symptom-checker',
    },
    {
      userId,
      title: 'Complete Your Profile',
      message: 'Add your date of birth and gender for more personalized recommendations.',
      type: 'info',
      link: '/profile',
    },
    {
      userId,
      title: 'Health Tip',
      message: 'Regular symptom tracking helps you notice health patterns early.',
      type: 'health',
      link: '/dashboard',
    },
  ]);
};
