// scripts/seed.js
// Run this ONCE to create the admin account
// Usage: node scripts/seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'YOUR_MONGODB_URI_HERE';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  class: String,
  rollNumber: String,
  isActive: Boolean,
  createdAt: Date,
});

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  
  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  
  // Check if admin exists
  const exists = await User.findOne({ email: 'shivam.tiwari@chinmayavidyalaya.edu' });
  if (exists) {
    console.log('⚠️  Admin already exists! Email: shivam.tiwari@chinmayavidyalaya.edu');
    process.exit(0);
  }
  
  const hashed = await bcrypt.hash('Admin@Vidyalaya123', 12);
  
  await User.create({
    name: 'Shivam Tiwari',
    email: 'shivam.tiwari@chinmayavidyalaya.edu',
    password: hashed,
    role: 'admin',
    class: 'XII', // admin class doesn't matter
    rollNumber: 'ADMIN001',
    isActive: true,
    createdAt: new Date(),
  });
  
  console.log('✅ Admin account created!');
  console.log('📧 Email: shivam.tiwari@chinmayavidyalaya.edu');
  console.log('🔑 Password: Admin@Vidyalaya123');
  console.log('⚠️  IMPORTANT: Change the password after first login!');
  
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(e => { console.error('❌ Seed failed:', e); process.exit(1); });
