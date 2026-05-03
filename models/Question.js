import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
  class: { type: String, enum: ['X', 'XII', 'Both'], required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  type: { type: String, enum: ['MCQ', 'Code', 'SQL', 'ShortAnswer', 'TrueFalse'], required: true },
  question: { type: String, required: true },
  options: [String], // for MCQ
  correctAnswer: { type: String, required: true },
  hint: { type: String },
  explanation: { type: String },
  starterCode: { type: String }, // for Code questions
  testCases: [{ input: String, expectedOutput: String }], // for Code questions
  marks: { type: Number, default: 1 },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  tags: [String],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
