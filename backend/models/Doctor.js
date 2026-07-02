import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      enum: [
        'General Practitioner',
        'Cardiologist',
        'Neurologist',
        'Dermatologist',
        'Gastroenterologist',
        'Pediatrician',
        'Psychiatrist',
        'Pulmonologist',
        'Infectious Disease Specialist',
      ],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    qualifications: [String],
    city: {
      type: String,
      required: true,
    },
    clinicAddress: String,
    consultationFee: Number,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    availability: {
      monday: { from: String, to: String },
      tuesday: { from: String, to: String },
      wednesday: { from: String, to: String },
      thursday: { from: String, to: String },
      friday: { from: String, to: String },
      saturday: { from: String, to: String },
      sunday: { from: String, to: String },
    },
    profilePicture: String,
    licenseNumber: String,
    isVerified: {
      type: Boolean,
      default: false,
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

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
