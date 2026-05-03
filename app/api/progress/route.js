import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Progress from '@/models/Progress';
import Submission from '@/models/Submission';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'my';
  const cls = searchParams.get('class') || session.user.class;

  if (type === 'leaderboard') {
    // Get all students of the class, compute scores
    const students = await User.find({ role: 'student', class: cls, isActive: true }).select('name rollNumber section');
    const submissions = await Submission.find({
      studentId: { $in: students.map(s => s._id) },
      status: 'evaluated',
    });

    const leaderboard = students.map(s => {
      const subs = submissions.filter(sub => sub.studentId.toString() === s._id.toString());
      const avgScore = subs.length > 0 ? Math.round(subs.reduce((a, b) => a + b.percentage, 0) / subs.length) : 0;
      const tests = subs.length;
      return { student: s, avgScore, tests, totalMarks: subs.reduce((a, b) => a + b.marksObtained, 0) };
    }).sort((a, b) => b.avgScore - a.avgScore || b.tests - a.tests);

    leaderboard.forEach((entry, i) => { entry.rank = i + 1; });
    return NextResponse.json({ leaderboard });
  }

  if (type === 'my') {
    const studentId = session.user.id;
    const progress = await Progress.find({ studentId }).sort({ date: -1 }).limit(30);
    const submissions = await Submission.find({ studentId }).populate('testId', 'title subject').sort({ submittedAt: -1 });

    // Compute topic-wise stats
    const topicStats = {};
    for (const sub of submissions) {
      const key = sub.testId?.subject || 'General';
      if (!topicStats[key]) topicStats[key] = { total: 0, sum: 0 };
      topicStats[key].total++;
      topicStats[key].sum += sub.percentage;
    }

    const topicGPA = Object.entries(topicStats).map(([subject, data]) => ({
      subject,
      avgScore: Math.round(data.sum / data.total),
      tests: data.total,
    }));

    return NextResponse.json({ progress, submissions, topicGPA });
  }

  if (type === 'admin' && session.user.role === 'admin') {
    // All student progress summary
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const activeToday = await Progress.distinct('studentId', { lastActive: { $gte: today } });
    const allProgress = await Progress.find({}).sort({ lastActive: -1 });

    return NextResponse.json({ activeToday: activeToday.length, allProgress });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type, details } = await request.json();
  await connectDB();

  await Progress.findOneAndUpdate(
    { studentId: session.user.id, date: new Date().toISOString().split('T')[0] },
    {
      $push: { activities: { type, ...details, timestamp: new Date() } },
      $inc: { dailyMinutes: details.duration || 0 },
      lastActive: new Date(),
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
