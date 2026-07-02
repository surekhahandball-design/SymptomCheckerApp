import Disease from '../models/Disease.js';

export const analyzeSymptoms = async (symptoms) => {
  try {
    // Fetch all active diseases
    const diseases = await Disease.find({ isActive: true });

    // Calculate probability for each disease
    const matches = diseases.map((disease) => {
      const matchingSymptoms = disease.symptoms.filter((s) =>
        symptoms.some((userSymptom) =>
          userSymptom.toLowerCase().includes(s.toLowerCase()) ||
          s.toLowerCase().includes(userSymptom.toLowerCase())
        )
      );

      const probability =
        matchingSymptoms.length > 0
          ? Math.round(
              (matchingSymptoms.length / Math.max(disease.symptoms.length, 1)) * 100
            )
          : 0;

      return {
        diseaseId: disease._id,
        name: disease.name,
        matchingSymptoms: matchingSymptoms.length,
        totalSymptoms: disease.symptoms.length,
        probability,
        severity: disease.severity,
        description: disease.description,
        causes: disease.causes,
        treatment: disease.treatment,
        doctorType: disease.doctorType,
        medicines: disease.medicines,
        tests: disease.tests,
        precautions: disease.precautions,
        emergencyWarning: disease.emergencyWarning,
        healthTips: disease.healthTips,
      };
    });

    // Filter diseases with probability > 0 and sort by probability
    const relevantDiseases = matches
      .filter((m) => m.probability > 0)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5); // Return top 5

    return relevantDiseases;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
};

export const getProbabilityScore = (matchingSymptoms, totalSymptoms, severity) => {
  const baseScore = (matchingSymptoms / totalSymptoms) * 100;
  const severityMultiplier = {
    low: 1,
    medium: 1.1,
    high: 1.2,
    critical: 1.3,
  };

  return Math.min(100, Math.round(baseScore * (severityMultiplier[severity] || 1)));
};
