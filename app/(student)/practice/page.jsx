'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { Play, RotateCcw, Lightbulb, CheckCircle, XCircle, Loader2, Code2, BookOpen } from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const CHALLENGES = [
  {
    id: 1, title: 'Hello, World!', difficulty: 'Easy', topic: 'Basics',
    description: 'Write a Python program to print "Hello, World!" on screen.',
    starterCode: '# Write your code here\n\n',
    testCases: [{ input: '', expectedOutput: 'Hello, World!' }],
    hint: 'Use the print() function',
    explanation: 'print("Hello, World!") is the most basic Python program.',
  },
  {
    id: 2, title: 'Sum of Two Numbers', difficulty: 'Easy', topic: 'Functions',
    description: 'Write a function add(a, b) that returns the sum of two numbers.',
    starterCode: 'def add(a, b):\n    # Write your code here\n    pass\n\nprint(add(3, 5))',
    testCases: [{ input: '', expectedOutput: '8' }],
    hint: 'Use the + operator to add two numbers',
    explanation: 'def add(a, b):\n    return a + b',
  },
  {
    id: 3, title: 'Read File Line by Line', difficulty: 'Medium', topic: 'File Handling',
    description: 'Write a program that reads a text file line by line and prints each word separated by #.\n(For practice: use a string with newlines instead of actual file)',
    starterCode: '# Simulate file content\ncontent = "Hello World\\nPython is fun\\nI love coding"\n\n# Process the content line by line\nfor line in content.split("\\n"):\n    # Join words with #\n    pass',
    testCases: [{ input: '', expectedOutput: 'Hello#World\nPython#is#fun\nI#love#coding' }],
    hint: 'Split each line by spaces, then join with #',
    explanation: 'Use line.split() to get words, then "#".join(words)',
  },
  {
    id: 4, title: 'Implement Stack', difficulty: 'Medium', topic: 'Data Structures',
    description: 'Implement a stack using a Python list with push, pop, and is_empty methods. Print the popped value.',
    starterCode: 'class Stack:\n    def __init__(self):\n        self.items = []\n    \n    def push(self, item):\n        pass  # Add to top\n    \n    def pop(self):\n        pass  # Remove from top\n    \n    def is_empty(self):\n        pass  # Return True if empty\n\ns = Stack()\ns.push(10)\ns.push(20)\ns.push(30)\nprint(s.pop())',
    testCases: [{ input: '', expectedOutput: '30' }],
    hint: 'Use list.append() for push and list.pop() for pop',
    explanation: 'Stack is LIFO - Last In First Out',
  },
  {
    id: 5, title: 'Count Vowels', difficulty: 'Easy', topic: 'Strings',
    description: 'Count the number of vowels in the string "Hello World Python Programming".',
    starterCode: 'text = "Hello World Python Programming"\nvowels = "aeiouAEIOU"\ncount = 0\n\n# Count vowels here\n\nprint(count)',
    testCases: [{ input: '', expectedOutput: '7' }],
    hint: 'Loop through each character and check if it is in vowels string',
    explanation: 'Use a for loop and check if char in vowels',
  },
  {
    id: 6, title: 'Exception Handling', difficulty: 'Medium', topic: 'Exception Handling',
    description: 'Write a program that divides 10 by 0 and handles the ZeroDivisionError, printing "Cannot divide by zero".',
    starterCode: '# Use try-except to handle the error\ntry:\n    result = 10 / 0\nexcept:\n    pass  # Print the error message',
    testCases: [{ input: '', expectedOutput: 'Cannot divide by zero' }],
    hint: 'Use except ZeroDivisionError:',
    explanation: 'try-except catches exceptions and handles them gracefully',
  },
]

export default function PracticePage() {
  const [challenge, setChallenge] = useState(CHALLENGES[0])
  const [code, setCode] = useState(CHALLENGES[0].starterCode)
  const [output, setOutput] = useState('')
  const [results, setResults] = useState(null)
  const [running, setRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [freeCode, setFreeCode] = useState('# Free practice area\n# Write any Python code here!\n\nprint("Hello from Chinmaya Vidyalaya!")\n')
  const [freeOutput, setFreeOutput] = useState('')
  const [freeRunning, setFreeRunning] = useState(false)
  const [tab, setTab] = useState('challenges')

  const selectChallenge = (c) => {
    setChallenge(c)
    setCode(c.starterCode)
    setOutput('')
    setResults(null)
    setShowHint(false)
  }

  const runCode = async () => {
    setRunning(true)
    setOutput('')
    setResults(null)
    try {
      const res = await fetch('/api/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code, language: 'python',
          topic: challenge.topic,
          testCases: challenge.testCases,
        }),
      })
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }
      setResults(data.results)
      const allPassed = data.results.every(r => r.passed)
      if (allPassed) toast.success('All test cases passed! 🎉')
      else toast.error('Some test cases failed. Check output.')
    } catch (e) {
      toast.error('Failed to run code')
    } finally {
      setRunning(false)
    }
  }

  const runFreeCode = async () => {
    setFreeRunning(true)
    setFreeOutput('')
    try {
      const res = await fetch('/api/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: freeCode, language: 'python', topic: 'Free Practice' }),
      })
      const data = await res.json()
      if (data.results?.[0]) {
        setFreeOutput(data.results[0].output || data.results[0].error || '')
      }
    } catch (e) {
      toast.error('Failed to run code')
    } finally {
      setFreeRunning(false)
    }
  }

  const diffColor = { Easy: 'text-green-600 bg-green-50', Medium: 'text-yellow-600 bg-yellow-50', Hard: 'text-red-600 bg-red-50' }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-green-600" /> Python Practice
          </h1>
          <p className="text-slate-500 text-sm mt-1">Practice coding with challenges from your syllabus</p>
        </div>
        <div className="flex gap-2">
          {['challenges', 'free'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                tab === t ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}>{t === 'free' ? '🆓 Free Code' : '🏆 Challenges'}</button>
          ))}
        </div>
      </div>

      {tab === 'challenges' ? (
        <div className="grid grid-cols-12 gap-4">
          {/* Challenge list */}
          <div className="col-span-3 space-y-2">
            <h3 className="font-medium text-slate-700 text-sm px-1">Challenges</h3>
            {CHALLENGES.map(c => (
              <button key={c.id} onClick={() => selectChallenge(c)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${
                  challenge.id === c.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}>
                <p className="font-medium text-slate-800 text-xs">{c.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${diffColor[c.difficulty]}`}>{c.difficulty}</span>
                  <span className="text-slate-400 text-xs">• {c.topic}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Editor area */}
          <div className="col-span-9 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {/* Problem */}
              <div className="p-4 border-b bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display font-semibold text-slate-800">{challenge.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${diffColor[challenge.difficulty]}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-slate-600 text-sm whitespace-pre-line">{challenge.description}</p>
                {showHint && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                    <p className="text-yellow-800 text-sm">💡 <strong>Hint:</strong> {challenge.hint}</p>
                  </div>
                )}
              </div>

              {/* Editor */}
              <div className="monaco-container">
                <MonacoEditor
                  height="300px"
                  language="python"
                  value={code}
                  onChange={setCode}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    fontFamily: "'Fira Code', monospace",
                    fontLigatures: true,
                  }}
                />
              </div>

              {/* Actions */}
              <div className="p-3 border-t bg-slate-50 flex items-center justify-between">
                <div className="flex gap-2">
                  <button onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg text-sm hover:bg-yellow-100 transition-colors">
                    <Lightbulb className="w-4 h-4" /> {showHint ? 'Hide' : 'Hint'}
                  </button>
                  <button onClick={() => { setCode(challenge.starterCode); setResults(null) }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                </div>
                <button onClick={runCode} disabled={running}
                  className="flex items-center gap-2 px-5 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg text-sm font-medium transition-colors">
                  {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {running ? 'Running...' : 'Run Code'}
                </button>
              </div>
            </div>

            {/* Results */}
            {results && (
              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <h3 className="font-medium text-slate-800 mb-3 text-sm">Test Results</h3>
                <div className="space-y-2">
                  {results.map((r, i) => (
                    <div key={i} className={`p-3 rounded-xl border text-sm ${
                      r.passed ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {r.passed
                          ? <CheckCircle className="w-4 h-4 text-green-600" />
                          : <XCircle className="w-4 h-4 text-red-500" />}
                        <span className={r.passed ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                          Test Case {i + 1}: {r.passed ? 'Passed ✓' : 'Failed ✗'}
                        </span>
                      </div>
                      {!r.passed && (
                        <div className="text-xs space-y-1 ml-6">
                          <p className="text-slate-600">Expected: <code className="bg-slate-100 px-1 rounded">{r.expected}</code></p>
                          <p className="text-slate-600">Got: <code className="bg-slate-100 px-1 rounded">{r.actual || r.error}</code></p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Free practice */
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-slate-800">Free Practice Area</h2>
              <p className="text-slate-500 text-sm">Write any Python code and run it!</p>
            </div>
            <button onClick={runFreeCode} disabled={freeRunning}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-xl text-sm font-medium transition-colors">
              {freeRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {freeRunning ? 'Running...' : 'Run'}
            </button>
          </div>
          <div className="monaco-container">
            <MonacoEditor
              height="400px"
              language="python"
              value={freeCode}
              onChange={setFreeCode}
              theme="vs-dark"
              options={{ fontSize: 14, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4, fontFamily: "'Fira Code', monospace" }}
            />
          </div>
          {freeOutput !== '' && (
            <div className="p-4 border-t bg-slate-900">
              <p className="text-slate-400 text-xs mb-2 font-mono">OUTPUT:</p>
              <pre className="text-green-300 text-sm font-mono whitespace-pre-wrap">{freeOutput || '(no output)'}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
