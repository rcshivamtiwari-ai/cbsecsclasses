import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, enum: ['Python', 'Networks', 'Database', 'AI', 'General'], required: true },
  class: { type: String, enum: ['X', 'XII', 'Both'], required: true },
  unit: { type: String }, // e.g., "Unit 1: Python"
  topic: { type: String, required: true },
  content: { type: String, required: true }, // Markdown content
  keyPoints: [String],
  syntax: { type: String }, // code syntax examples
  commonMistakes: [String],
  tips: [String],
  difficulty: { type: String, enum: ['Basic', 'Intermediate', 'Advanced'], default: 'Basic' },
  tags: [String],
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
