import mongoose from 'mongoose';

const LiveClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  class: { type: String, enum: ['X', 'XII', 'Both'], required: true },
  subject: { type: String, required: true },
  topic: { type: String },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // minutes
  meetingId: { type: String, required: true }, // Jitsi room name
  status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
  recordingUrl: { type: String },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.LiveClass || mongoose.model('LiveClass', LiveClassSchema);
