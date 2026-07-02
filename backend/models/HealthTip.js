import mongoose from 'mongoose';

const healthTipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Nutrition', 'Exercise', 'Mental Health', 'Sleep', 'Lifestyle', 'Prevention'],
      required: true,
    },
    image: String,
    priority: {
      type: Number,
      default: 1,
    },
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

const HealthTip = mongoose.model('HealthTip', healthTipSchema);
export default HealthTip;
