import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  await connectDB();
  const q = await Question.create({ ...body, createdBy: session.user.id });
  return NextResponse.json({ id: q._id }, { status: 201 });
}

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const cls = searchParams.get('class') || session.user.class;
  const subject = searchParams.get('subject');

  const query = { class: { $in: [cls, 'Both'] }, isActive: true };
  if (subject) query.subject = subject;

  const questions = await Question.find(query).sort({ subject: 1, difficulty: 1 });
  return NextResponse.json({ questions });
}
