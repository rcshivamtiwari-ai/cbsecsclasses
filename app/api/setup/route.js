import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// ONE-TIME SETUP ROUTE
// Visit: https://your-site.vercel.app/api/setup
// DELETE THIS FILE after your admin account is created!

export async function GET(request) {
  // Safety check — only works if no admin exists yet
  await connectDB();

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    return NextResponse.json({
      status: 'already_done',
      message: 'Admin account already exists! Go to your site and login.',
      email: existingAdmin.email,
    });
  }

  // Create the admin account
  const hashed = await bcrypt.hash('Admin@Vidyalaya123', 12);
  await User.create({
    name: 'Shivam Tiwari',
    email: 'shivam@vidyalaya.edu',
    password: hashed,
    role: 'admin',
    class: 'XII',
    rollNumber: 'ADMIN001',
    isActive: true,
    createdAt: new Date(),
  });

  return NextResponse.json({
    status: 'success',
    message: '✅ Admin account created successfully!',
    login_url: '/login',
    email: 'shivam@vidyalaya.edu',
    password: 'Admin@Vidyalaya123',
    important: 'CHANGE YOUR PASSWORD after first login! Then delete the file app/api/setup/route.js from GitHub.',
  });
}
