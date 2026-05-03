import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Progress from '@/models/Progress';
import Submission from '@/models/Submission';
import Attendance from '@/models/Attendance';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const cls = searchParams.get('class');
  const studentId = searchParams.get('studentId');
  const days = parseInt(searchParams.get('days') || '7');

  if (type === 'dashboard') {
    const since = new Date(); since.setDate(since.getDate() - days);
    const query = cls ? { class: cls, role: 'student' } : { role: 'student' };

    const totalStudents = await User.countDocuments(query);
    const activeStudents = await Progress.distinct('studentId', { lastActive: { $gte: since } });
    const submissions = await Submission.countDocuments({ submittedAt: { $gte: since } });
    const allSubmissions = await Submission.find({ submittedAt: { $gte: since } });
    const avgScore = allSubmissions.length > 0
      ? Math.round(allSubmissions.reduce((a, b) => a + b.percentage, 0) / allSubmissions.length)
      : 0;

    // Day-wise activity
    const dailyActivity = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const count = await Progress.countDocuments({ lastActive: { $gte: d, $lt: next } });
      dailyActivity.push({ date: d.toISOString().split('T')[0], count });
    }

    // Subject-wise avg
    const subjectStats = {};
    for (const s of allSubmissions) {
      const sub = s.testId?.subject || 'General';
      if (!subjectStats[sub]) subjectStats[sub] = { sum: 0, count: 0 };
      subjectStats[sub].sum += s.percentage;
      subjectStats[sub].count++;
    }

    return NextResponse.json({
      totalStudents,
      activeStudents: activeStudents.length,
      submissions,
      avgScore,
      dailyActivity,
      subjectStats,
    });
  }

  if (type === 'student' && studentId) {
    const student = await User.findById(studentId).select('-password');
    const progress = await Progress.find({ studentId }).sort({ date: -1 }).limit(30);
    const submissions = await Submission.find({ studentId })
      .populate('testId', 'title subject totalMarks')
      .sort({ submittedAt: -1 });
    const attendance = await Attendance.find({ studentId }).sort({ date: -1 }).limit(30);

    // Skill gaps: topics where avg < 50%
    const subMap = {};
    for (const s of submissions) {
      const key = s.testId?.subject || 'General';
      if (!subMap[key]) subMap[key] = { sum: 0, count: 0 };
      subMap[key].sum += s.percentage;
      subMap[key].count++;
    }
    const skillGaps = Object.entries(subMap)
      .map(([subject, d]) => ({ subject, avg: Math.round(d.sum / d.count) }))
      .filter(s => s.avg < 60)
      .sort((a, b) => a.avg - b.avg);

    return NextResponse.json({ student, progress, submissions, attendance, skillGaps });
  }

  if (type === 'inactive') {
    const since = new Date(); since.setDate(since.getDate() - 3);
    const activeIds = await Progress.distinct('studentId', { lastActive: { $gte: since } });
    const query = cls ? { class: cls, role: 'student' } : { role: 'student' };
    const inactive = await User.find({ ...query, _id: { $nin: activeIds }, isActive: true })
      .select('name email class rollNumber lastLogin');
    return NextResponse.json({ inactive });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}
