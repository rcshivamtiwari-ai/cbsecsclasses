import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Progress from '@/models/Progress';
import { authOptions } from '@/lib/auth';

// Using Piston API - completely free, no key needed
const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { code, language, topic, testCases } = await request.json();

  if (!code || !language) {
    return NextResponse.json({ error: 'Code and language required' }, { status: 400 });
  }

  // Map language names to Piston format
  const langMap = {
    python: { language: 'python', version: '3.10.0' },
    sql: { language: 'sqlite', version: '3.36.0' },
  };

  const lang = langMap[language.toLowerCase()];
  if (!lang) return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });

  try {
    let results = [];

    if (testCases && testCases.length > 0) {
      // Run against test cases
      for (const tc of testCases) {
        const resp = await fetch(PISTON_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...lang,
            files: [{ name: 'main.py', content: code }],
            stdin: tc.input || '',
          }),
        });
        const data = await resp.json();
        const output = data.run?.stdout?.trim() || '';
        const error = data.run?.stderr?.trim() || '';
        results.push({
          input: tc.input,
          expected: tc.expectedOutput,
          actual: output,
          passed: output === tc.expectedOutput?.trim(),
          error,
        });
      }
    } else {
      // Just run the code
      const resp = await fetch(PISTON_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lang,
          files: [{ name: 'main.py', content: code }],
        }),
      });
      const data = await resp.json();
      results = [{ output: data.run?.stdout || '', error: data.run?.stderr || '', exitCode: data.run?.code }];
    }

    // Track progress
    await connectDB();
    await Progress.findOneAndUpdate(
      { studentId: session.user.id, date: new Date().toISOString().split('T')[0] },
      {
        $push: {
          activities: {
            type: 'code_run',
            details: language,
            subject: language === 'python' ? 'Python' : 'Database',
            topic: topic || 'Practice',
            timestamp: new Date(),
          },
          codeSubmissions: {
            code: code.substring(0, 500),
            language,
            topic: topic || 'Practice',
            passed: results.every(r => r.passed !== false),
            timestamp: new Date(),
          },
        },
        lastActive: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json({ error: 'Execution failed. Please try again.' }, { status: 500 });
  }
}
