'use client'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { ClipboardList, Clock, CheckCircle, XCircle, Trophy, AlertCircle, Send, Loader2 } from 'lucide-react'

export default function TestsPage() {
  const [tests, setTests] = useState([])
  const [activeTest, setActiveTest] = useState(null)
  const [testData, setTestData] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [mySubmissions, setMySubmissions] = useState([])
  const [tab, setTab] = useState('available')
  const timerRef = useRef(null)

  useEffect(() => {
    fetchTests()
    fetchMySubmissions()
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && activeTest) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [timeLeft, activeTest])

  const fetchTests = async () => {
    const res = await fetch('/api/tests')
    const data = await res.json()
    setTests(data.tests || [])
  }

  const fetchMySubmissions = async () => {
    const res = await fetch('/api/tests/submit')
    const data = await res.json()
    setMySubmissions(data.submissions || [])
  }

  const startTest = async (test) => {
    const res = await fetch(`/api/tests?id=${test._id}`)
    const data = await res.json()
    setTestData(data.test)
    setActiveTest(test)
    setAnswers({})
    setResult(null)
    setTimeLeft(test.duration * 60)
  }

  const handleSubmit = async () => {
    if (submitting) return
    clearInterval(timerRef.current)
    setSubmitting(true)

    const submittedAnswers = testData.questions.map(q => ({
      questionId: q._id,
      answer: answers[q._id] || '',
    }))

    const res = await fetch('/api/tests/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testId: activeTest._id,
        answers: submittedAnswers,
        timeUsed: (activeTest.duration * 60) - timeLeft,
      }),
    })
    const data = await res.json()
    setSubmitting(false)
    setResult(data)
    setActiveTest(null)
    fetchMySubmissions()
    toast.success(`Test submitted! Score: ${data.percentage}%`)
  }

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

  const alreadySubmitted = (testId) => mySubmissions.some(s => s.testId?._id === testId || s.testId === testId)

  // Active test UI
  if (activeTest && testData) {
    const answered = Object.keys(answers).length
    const total = testData.questions.length
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Test header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-slate-800">{testData.title}</h1>
              <p className="text-slate-500 text-sm">{answered}/{total} answered</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 font-display font-bold text-xl ${
                timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-700'
              }`}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Test
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-slate-100 rounded-full h-2">
            <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${(answered/total)*100}%` }} />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {testData.questions.map((q, idx) => (
            <div key={q._id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-slate-800 font-medium">{q.question}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-slate-500">{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{q.type}</span>
                  </div>
                </div>
              </div>

              {q.type === 'MCQ' && (
                <div className="space-y-2 ml-10">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      answers[q._id] === opt
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}>
                      <input type="radio" name={q._id} value={opt}
                        checked={answers[q._id] === opt}
                        onChange={() => setAnswers(a => ({ ...a, [q._id]: opt }))}
                        className="text-brand-600" />
                      <span className="text-slate-700 text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'TrueFalse' && (
                <div className="flex gap-3 ml-10">
                  {['True', 'False'].map(opt => (
                    <label key={opt} className={`flex items-center gap-2 px-5 py-2 rounded-xl border cursor-pointer transition-all ${
                      answers[q._id] === opt ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-100 hover:border-slate-200 text-slate-700'
                    }`}>
                      <input type="radio" name={q._id} value={opt}
                        checked={answers[q._id] === opt}
                        onChange={() => setAnswers(a => ({ ...a, [q._id]: opt }))}
                        className="text-brand-600" />
                      <span className="font-medium text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'ShortAnswer' && (
                <textarea
                  className="w-full ml-10 mt-1 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  rows={3}
                  placeholder="Type your answer here..."
                  value={answers[q._id] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [q._id]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Submit Test ({answered}/{total} answered)
          </button>
        </div>
      </div>
    )
  }

  // Result screen
  if (result) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 animate-slide-up">
        <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
          result.percentage >= 80 ? 'bg-green-100' : result.percentage >= 33 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          {result.percentage >= 80
            ? <Trophy className="w-12 h-12 text-green-600" />
            : result.percentage >= 33
            ? <AlertCircle className="w-12 h-12 text-yellow-600" />
            : <XCircle className="w-12 h-12 text-red-500" />}
        </div>
        <h2 className="font-display text-3xl font-bold text-slate-800 mb-2">Test Complete!</h2>
        <div className={`inline-block px-6 py-3 rounded-2xl mb-4 ${
          result.percentage >= 80 ? 'bg-green-100' : result.percentage >= 33 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          <p className={`text-4xl font-display font-bold ${
            result.percentage >= 80 ? 'text-green-700' : result.percentage >= 33 ? 'text-yellow-700' : 'text-red-600'
          }`}>{result.percentage}%</p>
          <p className="text-slate-600 text-sm">Grade: {result.grade} • {result.marksObtained}/{result.submission?.totalMarks || '?'} marks</p>
        </div>
        <p className="text-slate-500 mb-6">
          {result.percentage >= 80 ? '🎉 Excellent work!' : result.percentage >= 60 ? '👍 Good effort!' : result.percentage >= 33 ? '📚 Keep studying!' : '💪 Practice more, you can do it!'}
        </p>
        <button onClick={() => setResult(null)}
          className="bg-brand-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-brand-700">
          Back to Tests
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-orange-500" /> Tests & Exams
        </h1>
        <p className="text-slate-500 text-sm mt-1">Take tests assigned by your teacher</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['available', 'my-results'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}>{t === 'available' ? '📋 Available Tests' : '📊 My Results'}</button>
        ))}
      </div>

      {tab === 'available' ? (
        <div className="space-y-3">
          {tests.filter(t => t.status === 'live' || t.status === 'scheduled').length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <ClipboardList className="w-16 h-16 mx-auto mb-4 text-slate-200" />
              <p className="text-slate-500 font-medium">No tests available right now</p>
              <p className="text-slate-400 text-sm">Your teacher will schedule tests soon</p>
            </div>
          ) : (
            tests.filter(t => ['live', 'scheduled'].includes(t.status)).map(test => (
              <div key={test._id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-slate-800">{test.title}</h3>
                    {test.status === 'live' && <span className="live-dot text-red-500 text-xs font-medium">LIVE</span>}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span>{test.subject}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{test.duration} min</span>
                    <span>•</span>
                    <span>{test.totalMarks} marks</span>
                  </div>
                </div>
                {alreadySubmitted(test._id)
                  ? <span className="flex items-center gap-1 text-green-600 text-sm font-medium"><CheckCircle className="w-4 h-4" /> Submitted</span>
                  : <button onClick={() => startTest(test)}
                      className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
                      Start Test →
                    </button>
                }
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {mySubmissions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-200" />
              <p className="text-slate-500">No test results yet</p>
            </div>
          ) : (
            mySubmissions.map(s => (
              <div key={s._id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-slate-800">{s.testId?.title}</h3>
                  <p className="text-slate-500 text-sm">{s.testId?.subject} • {new Date(s.submittedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className={`font-display font-bold text-2xl ${s.percentage >= 80 ? 'text-green-600' : s.percentage >= 33 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {s.percentage}%
                  </p>
                  <p className="text-slate-500 text-sm">Grade: {s.grade} • {s.marksObtained}/{s.totalMarks}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
