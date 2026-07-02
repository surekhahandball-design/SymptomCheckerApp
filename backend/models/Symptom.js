import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Symptom name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['General', 'Respiratory', 'Digestive', 'Neurological', 'Skin', 'Mental Health', 'Women Health', 'Children'],
      required: true,
    },
    description: String,
    relatedDiseases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disease',
      },
    ],
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

const Symptom = mongoose.model('Symptom', symptomSchema);
export default Symptom;
