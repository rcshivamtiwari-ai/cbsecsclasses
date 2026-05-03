import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveClass' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: String, enum: ['X', 'XII'] },
  date: { type: Date, required: true },
  joinedAt: { type: Date },
  leftAt: { type: Date },
  duration: { type: Number }, // minutes in class
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
  markedBy: { type: String, enum: ['system', 'admin'], default: 'system' },
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
