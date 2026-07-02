import Symptom from '../models/Symptom.js';
import History from '../models/History.js';
import { analyzeSymptoms } from '../services/diseaseAnalyzer.js';
import { createNotification } from '../utils/createNotification.js';

export const getAllSymptoms = async (req, res) => {
  try {
    const { category } = req.query;

    const query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const symptoms = await Symptom.find(query).sort({ name: 1 });

    res.json({
      success: true,
      data: symptoms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSymptomsGroupedByCategory = async (req, res) => {
  try {
    const symptoms = await Symptom.find({ isActive: true }).sort({ name: 1 });

    const grouped = {};
    symptoms.forEach((symptom) => {
      if (!grouped[symptom.category]) {
        grouped[symptom.category] = [];
      }
      grouped[symptom.category].push(symptom);
    });

    res.json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkSymptoms = async (req, res) => {
  try {
    const { selectedSymptoms, textInput } = req.body;

    if (!selectedSymptoms || selectedSymptoms.length === 0) {
      return res.status(400).json({ message: 'Please select at least one symptom' });
    }

    // Combine selected symptoms and text input
    const allSymptoms = [...selectedSymptoms];
    if (textInput) {
      allSymptoms.push(textInput);
    }

    // Analyze symptoms
    const results = await analyzeSymptoms(allSymptoms);

    // Save to history
    const history = new History({
      userId: req.user.userId,
      selectedSymptoms,
      textInput,
      results: results.map((r) => ({
        diseaseId: r.diseaseId,
        diseaseName: r.name,
        probability: r.probability,
        severity: r.severity,
      })),
      totalResults: results.length,
    });

    await history.save();

    await createNotification(req.user.userId, {
      title: 'Symptom Analysis Complete',
      message: `Found ${results.length} possible condition(s) based on your symptoms. View your results in health history.`,
      type: 'health',
      link: '/history',
    });

    res.json({
      success: true,
      message: 'Symptoms analyzed successfully',
      data: {
        results,
        historyId: history._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSymptom = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    const existingSymptom = await Symptom.findOne({ name });
    if (existingSymptom) {
      return res.status(409).json({ message: 'Symptom already exists' });
    }

    const symptom = new Symptom({
      name,
      category,
      description,
    });

    await symptom.save();

    res.status(201).json({
      success: true,
      message: 'Symptom created successfully',
      data: symptom,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSymptom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, isActive } = req.body;

    const symptom = await Symptom.findByIdAndUpdate(
      id,
      { name, category, description, isActive },
      { new: true, runValidators: true }
    );

    if (!symptom) {
      return res.status(404).json({ message: 'Symptom not found' });
    }

    res.json({
      success: true,
      message: 'Symptom updated successfully',
      data: symptom,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSymptom = async (req, res) => {
  try {
    const { id } = req.params;

    const symptom = await Symptom.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!symptom) {
      return res.status(404).json({ message: 'Symptom not found' });
    }

    res.json({
      success: true,
      message: 'Symptom deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
