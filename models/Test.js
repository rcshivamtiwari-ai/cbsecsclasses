import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  class: { type: String, enum: ['X', 'XII'], required: true },
  subject: { type: String, required: true },
  description: { type: String },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  totalMarks: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  scheduledAt: { type: Date },
  endsAt: { type: Date },
  status: { type: String, enum: ['draft', 'scheduled', 'live', 'completed'], default: 'draft' },
  isPublic: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Test || mongoose.model('Test', TestSchema);
