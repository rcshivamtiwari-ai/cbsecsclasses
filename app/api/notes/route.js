import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const cls = searchParams.get('class') || session.user.class;
  const query = { isPublished: true };
  if (subject) query.subject = subject;
  if (cls) query.$or = [{ class: cls }, { class: 'Both' }];

  const notes = await Note.find(query).sort({ subject: 1, order: 1 });
  return NextResponse.json({ notes });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  await connectDB();
  const note = await Note.create({ ...body, createdBy: session.user.id });
  return NextResponse.json({ message: 'Note created', note }, { status: 201 });
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updates } = body;
  await connectDB();
  const note = await Note.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
  return NextResponse.json({ note });
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await connectDB();
  await Note.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}
