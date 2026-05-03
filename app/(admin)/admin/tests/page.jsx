'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { ClipboardList, Plus, Play, Square, Trash2, X, Loader2, Eye, Users } from 'lucide-react'

const defaultTest = { title: '', class: 'XII', subject: 'Python', description: '', duration: 30, totalMarks: 0, status: 'draft' }
const defaultQ = { type: 'MCQ', question: '', options: ['','','',''], correctAnswer: '', marks: 1, hint: '', explanation: '', difficulty: 'Easy', topic: '' }

export default function AdminTests() {
  const [tests, setTests] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [testForm, setTestForm] = useState(defaultTest)
  const [questions, setQuestions] = useState([{ ...defaultQ }])
  const [saving, setSaving] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)
  const [submissions, setSubmissions] = useState([])

  useEffect(() => { loadTests() }, [])

  const loadTests = async () => {
    const res = await fetch('/api/tests')
    const data = await res.json()
    setTests(data.tests || [])
  }

  const viewSubmissions = async (test) => {
    setSelectedTest(test)
    const res = await fetch(`/api/tests/submit?testId=${test._id}`)
    const data = await res.json()
    setSubmissions(data.submissions || [])
  }

  const updateStatus = async (testId, status) => {
    await fetch('/api/tests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: testId, status }),
    })
    toast.success(`Test ${status === 'live' ? 'started!' : 'ended!'}`)
    loadTests()
  }

  const addQuestion = () => setQuestions(qs => [...qs, { ...defaultQ, options: ['','','',''] }])
  const removeQuestion = (i) => setQuestions(qs => qs.filter((_, idx) => idx !== i))

  const updateQuestion = (idx, key, value) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, [key]: value } : q))
  }

  const updateOption = (qIdx, oIdx, value) => {
    setQuestions(qs => qs.map((q, i) => {
      if (i !== qIdx) return q
      const opts = [...q.options]
      opts[oIdx] = value
      return { ...q, options: opts }
    }))
  }

  const saveTest = async () => {
    if (!testForm.title || questions.length === 0) { toast.error('Add title and at least one question'); return }
    setSaving(true)
    try {
      // First create questions via a batch approach — embed in test for simplicity
      const totalMarks = questions.reduce((a, q) => a + Number(q.marks), 0)

      // Create questions individually (using test API to handle question creation)
      const questionIds = []
      for (const q of questions) {
        const res = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...q, class: testForm.class, subject: testForm.subject }),
        })
        const data = await res.json()
        if (data.id) questionIds.push(data.id)
      }

      const res = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...testForm, questions: questionIds, totalMarks }),
      })
      if (res.ok) {
        toast.success('Test created!')
        setShowCreate(false)
        setTestForm(defaultTest)
        setQuestions([{ ...defaultQ }])
        loadTests()
      } else toast.error('Failed to create test')
    } catch (e) {
      toast.error('Error creating test')
    } finally {
      setSaving(false)
    }
  }

  const statusColor = { draft: 'bg-slate-100 text-slate-600', scheduled: 'bg-blue-100 text-blue-700', live: 'bg-red-100 text-red-700', completed: 'bg-green-100 text-green-700' }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-orange-500" /> Tests & Exams
          </h1>
          <p className="text-slate-500 text-sm">{tests.length} tests created</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> Create Test
        </button>
      </div>

      <div className="space-y-3">
        {tests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-slate-200" />
            <p className="text-slate-500">No tests yet. Create your first test!</p>
          </div>
        ) : tests.map(test => (
          <div key={test._id} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-slate-800">{test.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[test.status]}`}>
                    {test.status === 'live' ? '🔴 LIVE' : test.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>Class {test.class}</span>
                  <span>•</span>
                  <span>{test.subject}</span>
                  <span>•</span>
                  <span>{test.duration} min</span>
                  <span>•</span>
                  <span>{test.totalMarks} marks</span>
                  <span>•</span>
                  <span>{test.questions?.length || 0} questions</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => viewSubmissions(test)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs hover:bg-slate-100">
                  <Users className="w-3 h-3" /> Results
                </button>
                {test.status === 'draft' && (
                  <button onClick={() => updateStatus(test._id, 'live')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs">
                    <Play className="w-3 h-3" /> Go Live
                  </button>
                )}
                {test.status === 'live' && (
                  <button onClick={() => updateStatus(test._id, 'completed')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs">
                    <Square className="w-3 h-3" /> End Test
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submissions modal */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="font-display font-bold text-slate-800">Results: {selectedTest.title}</h2>
                <p className="text-slate-500 text-sm">{submissions.length} submissions</p>
              </div>
              <button onClick={() => setSelectedTest(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-5">
              {submissions.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No submissions yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Student</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Roll No</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Score</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Grade</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {submissions.sort((a, b) => b.percentage - a.percentage).map((s, i) => (
                        <tr key={s._id} className={i === 0 ? 'bg-yellow-50' : ''}>
                          <td className="px-3 py-2 font-medium text-slate-800">{s.studentId?.name}</td>
                          <td className="px-3 py-2 text-slate-500 font-mono">{s.studentId?.rollNumber}</td>
                          <td className="px-3 py-2">
                            <span className={`font-bold ${s.percentage >= 80 ? 'text-green-600' : s.percentage >= 33 ? 'text-yellow-600' : 'text-red-500'}`}>
                              {s.percentage}%
                            </span>
                            <span className="text-slate-400 text-xs ml-1">({s.marksObtained}/{s.totalMarks})</span>
                          </td>
                          <td className="px-3 py-2"><span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-full">{s.grade}</span></td>
                          <td className="px-3 py-2 text-slate-500 text-xs">{s.timeUsed ? `${Math.round(s.timeUsed/60)} min` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create test modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-4 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="font-display font-bold text-slate-800">Create New Test</h2>
              <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Test details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Test Title *</label>
                  <input value={testForm.title} onChange={e => setTestForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g., Unit Test 1 - Python Functions"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                {[
                  { key: 'class', label: 'Class', type: 'select', options: ['X','XII'] },
                  { key: 'subject', label: 'Subject', type: 'select', options: ['Python','Networks','Database','AI'] },
                  { key: 'duration', label: 'Duration (minutes)', type: 'number' },
                  { key: 'description', label: 'Description', type: 'text' },
                ].map(({ key, label, type, options }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">{label}</label>
                    {type === 'select' ? (
                      <select value={testForm[key]} onChange={e => setTestForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                        {options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={type} value={testForm[key]} onChange={e => setTestForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    )}
                  </div>
                ))}
              </div>

              {/* Questions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-700">Questions ({questions.length})</h3>
                  <button onClick={addQuestion}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl text-xs hover:bg-brand-100">
                    <Plus className="w-3 h-3" /> Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-slate-700">Q{idx + 1}</span>
                        {questions.length > 1 && (
                          <button onClick={() => removeQuestion(idx)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Type</label>
                          <select value={q.type} onChange={e => updateQuestion(idx, 'type', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                            {['MCQ','TrueFalse','ShortAnswer'].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Marks</label>
                          <input type="number" min="1" value={q.marks} onChange={e => updateQuestion(idx, 'marks', Number(e.target.value))}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Topic</label>
                          <input value={q.topic} onChange={e => updateQuestion(idx, 'topic', e.target.value)}
                            placeholder="Functions"
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="text-xs text-slate-500 mb-1 block">Question *</label>
                        <textarea value={q.question} onChange={e => updateQuestion(idx, 'question', e.target.value)}
                          rows={2} placeholder="Type your question here..."
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white resize-none" />
                      </div>
                      {q.type === 'MCQ' && (
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {q.options.map((opt, oi) => (
                            <input key={oi} value={opt} onChange={e => updateOption(idx, oi, e.target.value)}
                              placeholder={`Option ${oi+1}`}
                              className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
                          ))}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Correct Answer *</label>
                          {q.type === 'TrueFalse' ? (
                            <select value={q.correctAnswer} onChange={e => updateQuestion(idx, 'correctAnswer', e.target.value)}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                              <option value="">Select...</option>
                              <option>True</option><option>False</option>
                            </select>
                          ) : (
                            <input value={q.correctAnswer} onChange={e => updateQuestion(idx, 'correctAnswer', e.target.value)}
                              placeholder={q.type === 'MCQ' ? 'Copy exact option text' : 'Expected answer'}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Hint (optional)</label>
                          <input value={q.hint} onChange={e => updateQuestion(idx, 'hint', e.target.value)}
                            placeholder="Give a hint..."
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={saveTest} disabled={saving}
                  className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:bg-brand-300 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : '✅ Create Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
