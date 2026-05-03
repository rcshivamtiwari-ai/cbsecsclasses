import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    answer: String,
    isCorrect: Boolean,
    marksAwarded: Number,
    timeTaken: Number, // seconds
  }],
  totalMarks: { type: Number },
  marksObtained: { type: Number },
  percentage: { type: Number },
  grade: { type: String },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  timeUsed: { type: Number }, // seconds
  status: { type: String, enum: ['started', 'submitted', 'evaluated'], default: 'started' },
});

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
