import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: mongoose.Schema.Types.Mixed,
  updatedAt: { type: Date, default: Date.now },
});

const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const settings = await Setting.find({});
  const result = {};
  settings.forEach(s => { result[s.key] = s.value; });

  // defaults
  if (!result.enrollmentOpen) result.enrollmentOpen = false;
  if (!result.openToPublic) result.openToPublic = false;

  return NextResponse.json(result);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  await connectDB();

  for (const [key, value] of Object.entries(body)) {
    await Setting.findOneAndUpdate(
      { key },
      { key, value, updatedAt: new Date() },
      { upsert: true }
    );
  }

  return NextResponse.json({ ok: true });
}
