import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Disease name is required'],
      unique: true,
      trim: true,
    },
    symptoms: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    causes: [String],
    treatment: {
      type: String,
      required: true,
    },
    doctorType: [String], // e.g., ['Cardiologist', 'General Practitioner']
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    medicines: [
      {
        name: String,
        dosage: String,
        frequency: String,
      },
    ],
    tests: [String],
    precautions: [String],
    emergencyWarning: String,
    healthTips: [String],
    icd10Code: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Disease = mongoose.model('Disease', diseaseSchema);
export default Disease;
