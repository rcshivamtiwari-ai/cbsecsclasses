import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Test from '@/models/Test';
import Question from '@/models/Question';
import Submission from '@/models/Submission';
import Progress from '@/models/Progress';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { testId, answers, timeUsed } = await request.json();

  await connectDB();
  const test = await Test.findById(testId).populate('questions');
  if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

  // Evaluate answers
  let marksObtained = 0;
  const evaluated = answers.map(a => {
    const q = test.questions.find(q => q._id.toString() === a.questionId);
    if (!q) return a;
    const isCorrect = q.correctAnswer.trim().toLowerCase() === a.answer?.trim()?.toLowerCase();
    const marksAwarded = isCorrect ? q.marks : 0;
    marksObtained += marksAwarded;
    return { ...a, isCorrect, marksAwarded };
  });

  const percentage = Math.round((marksObtained / test.totalMarks) * 100);
  const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 33 ? 'D' : 'F';

  const submission = await Submission.create({
    testId,
    studentId: session.user.id,
    answers: evaluated,
    totalMarks: test.totalMarks,
    marksObtained,
    percentage,
    grade,
    timeUsed,
    submittedAt: new Date(),
    status: 'evaluated',
  });

  // Track in progress
  await Progress.findOneAndUpdate(
    { studentId: session.user.id, date: new Date().toISOString().split('T')[0] },
    {
      $push: {
        activities: {
          type: 'test_taken',
          details: test.title,
          subject: test.subject,
          score: percentage,
          timestamp: new Date(),
        },
      },
      lastActive: new Date(),
    },
    { upsert: true }
  );

  return NextResponse.json({ submission, percentage, grade, marksObtained });
}

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const testId = searchParams.get('testId');

  const query = session.user.role === 'admin'
    ? (testId ? { testId } : {})
    : { studentId: session.user.id, ...(testId ? { testId } : {}) };

  const submissions = await Submission.find(query)
    .populate('testId', 'title subject totalMarks')
    .populate('studentId', 'name rollNumber class section')
    .sort({ submittedAt: -1 });

  return NextResponse.json({ submissions });
}
