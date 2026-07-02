import History from '../models/History.js';

export const getSymptomHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const history = await History.find({ userId: req.user.userId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await History.countDocuments({ userId: req.user.userId });

    res.json({
      success: true,
      data: history,
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

export const getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await History.findById(id);

    if (!history) {
      return res.status(404).json({ message: 'History not found' });
    }

    if (history.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHistoryRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await History.findByIdAndDelete(id);

    if (!history) {
      return res.status(404).json({ message: 'History not found' });
    }

    if (history.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({
      success: true,
      message: 'History deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllHistory = async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user.userId });

    res.json({
      success: true,
      message: 'All history deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportHistoryAsPDF = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.userId });

    // TODO: Implement PDF generation using a library like PDFKit or jsPDF

    res.json({
      success: true,
      message: 'PDF generation not yet implemented',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
