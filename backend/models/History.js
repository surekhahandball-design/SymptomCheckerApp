import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    selectedSymptoms: [String],
    textInput: String,
    results: [
      {
        diseaseId: mongoose.Schema.Types.ObjectId,
        diseaseName: String,
        probability: Number,
        severity: String,
      },
    ],
    totalResults: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const History = mongoose.model('History', historySchema);
export default History;
