import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    patientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      default: '',
    },
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    notes: String,
    prescription: String,
    meetLink: String,
    consultationType: {
      type: String,
      enum: ['in-person', 'online'],
      default: 'in-person',
    },
    cancelReason: String,
    cancelledAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

appointmentSchema.index({ userId: 1, doctorId: 1, appointmentDate: 1, appointmentTime: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
