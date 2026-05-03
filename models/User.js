import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  class: { type: String, enum: ['X', 'XII'], required: true },
  section: { type: String, default: 'A' },
  rollNumber: { type: String, required: true },
  fatherName: { type: String },
  phone: { type: String },
  village: { type: String },
  distanceFromSchool: { type: Number }, // in km
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginHistory: [{ date: Date }],
  profilePic: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
