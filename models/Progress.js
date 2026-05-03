import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  activities: [{
    type: { type: String, enum: ['note_read', 'code_run', 'sql_run', 'test_taken', 'class_joined', 'question_attempted'] },
    details: String,
    subject: String,
    topic: String,
    score: Number,
    duration: Number, // minutes
    timestamp: { type: Date, default: Date.now },
  }],
  noteReads: [{ noteId: mongoose.Schema.Types.ObjectId, readAt: Date }],
  codeSubmissions: [{
    code: String,
    language: String,
    topic: String,
    passed: Boolean,
    timestamp: Date,
  }],
  topicScores: [{
    subject: String,
    topic: String,
    score: Number,
    attempts: Number,
    lastAttempt: Date,
  }],
  dailyMinutes: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastActive: { type: Date },
});

ProgressSchema.index({ studentId: 1, date: 1 });

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
