import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const cls = searchParams.get('class');
  const studentId = searchParams.get('studentId');
  const month = searchParams.get('month'); // YYYY-MM

  let query = {};

  if (session.user.role === 'admin') {
    if (studentId) query.studentId = studentId;
    if (cls) {
      const students = await User.find({ class: cls, role: 'student' }).select('_id');
      query.studentId = { $in: students.map(s => s._id) };
    }
  } else {
    query.studentId = session.user.id;
  }

  if (month) {
    const start = new Date(`${month}-01`);
    const end = new Date(start); end.setMonth(end.getMonth() + 1);
    query.date = { $gte: start, $lt: end };
  }

  const records = await Attendance.find(query)
    .populate('studentId', 'name rollNumber class')
    .populate('classId', 'title subject')
    .sort({ date: -1 })
    .limit(100);

  // Summary stats
  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return NextResponse.json({ records, summary: { total, present, percentage } });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { studentId, classId, date, status } = await request.json();
  await connectDB();

  const record = await Attendance.findOneAndUpdate(
    { studentId, date: new Date(date) },
    { studentId, classId, date: new Date(date), status, markedBy: 'admin' },
    { upsert: true, new: true }
  );

  return NextResponse.json({ record });
}
