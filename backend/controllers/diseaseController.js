import Disease from '../models/Disease.js';

export const getAllDiseases = async (req, res) => {
  try {
    const { severity, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };
    if (severity) {
      query.severity = severity;
    }

    const diseases = await Disease.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Disease.countDocuments(query);

    res.json({
      success: true,
      data: diseases,
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

export const getDiseaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const disease = await Disease.findById(id);

    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    res.json({
      success: true,
      data: disease,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDisease = async (req, res) => {
  try {
    const { name, symptoms, description, causes, treatment, doctorType, severity, medicines, tests, precautions, emergencyWarning, healthTips, icd10Code } = req.body;

    const existingDisease = await Disease.findOne({ name });
    if (existingDisease) {
      return res.status(409).json({ message: 'Disease already exists' });
    }

    const disease = new Disease({
      name,
      symptoms,
      description,
      causes,
      treatment,
      doctorType,
      severity,
      medicines,
      tests,
      precautions,
      emergencyWarning,
      healthTips,
      icd10Code,
    });

    await disease.save();

    res.status(201).json({
      success: true,
      message: 'Disease created successfully',
      data: disease,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDisease = async (req, res) => {
  try {
    const { id } = req.params;

    const disease = await Disease.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    res.json({
      success: true,
      message: 'Disease updated successfully',
      data: disease,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDisease = async (req, res) => {
  try {
    const { id } = req.params;

    const disease = await Disease.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    res.json({
      success: true,
      message: 'Disease deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchDiseases = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const diseases = await Disease.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
      isActive: true,
    }).limit(10);

    res.json({
      success: true,
      data: diseases,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
