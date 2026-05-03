'use client'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { Database, Play, Loader2, Table, RefreshCw, BookOpen } from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const PRESET_QUERIES = [
  {
    label: '📋 Show all tables',
    query: `.tables`
  },
  {
    label: '📚 Create Student Table',
    query: `CREATE TABLE IF NOT EXISTS students (
  rollno INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT,
  marks INTEGER,
  city TEXT
);

INSERT INTO students VALUES (1, 'Rahul Sharma', 'XII', 85, 'Unchahar');
INSERT INTO students VALUES (2, 'Priya Singh', 'XII', 92, 'Raebareli');
INSERT INTO students VALUES (3, 'Amit Kumar', 'X', 78, 'Unchahar');
INSERT INTO students VALUES (4, 'Sneha Gupta', 'X', 88, 'Lucknow');
INSERT INTO students VALUES (5, 'Rohit Verma', 'XII', 65, 'Allahabad');

SELECT * FROM students;`
  },
  {
    label: '🔍 SELECT with WHERE',
    query: `SELECT name, marks FROM students
WHERE marks > 80
ORDER BY marks DESC;`
  },
  {
    label: '📊 GROUP BY & Aggregate',
    query: `SELECT class, 
       COUNT(*) as total_students,
       AVG(marks) as avg_marks,
       MAX(marks) as highest,
       MIN(marks) as lowest
FROM students
GROUP BY class;`
  },
  {
    label: '✏️ UPDATE Record',
    query: `UPDATE students 
SET marks = 95 
WHERE rollno = 2;

SELECT * FROM students WHERE rollno = 2;`
  },
  {
    label: '🗑️ DELETE Record',
    query: `DELETE FROM students WHERE rollno = 5;
SELECT * FROM students;`
  },
  {
    label: '🔗 JOIN Example',
    query: `CREATE TABLE IF NOT EXISTS subjects (
  rollno INTEGER,
  subject TEXT,
  score INTEGER
);
INSERT INTO subjects VALUES (1, 'Python', 90);
INSERT INTO subjects VALUES (2, 'Python', 95);
INSERT INTO subjects VALUES (3, 'AI', 80);

SELECT s.name, sub.subject, sub.score
FROM students s
JOIN subjects sub ON s.rollno = sub.rollno;`
  },
]

export default function SQLPage() {
  const [query, setQuery] = useState('-- Welcome to SQL Practice!\n-- Click a preset above or write your own SQL query\n\nSELECT "Hello from SQL!" as greeting;')
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [running, setRunning] = useState(false)
  const [db, setDb] = useState(null)
  const [dbLoaded, setDbLoaded] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(null)

  useEffect(() => {
    // Load sql.js from CDN
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js'
    script.onload = async () => {
      try {
        const SQL = await window.initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
        })
        const database = new SQL.Database()
        setDb(database)
        setDbLoaded(true)
        toast.success('SQL Engine loaded! ✅')
      } catch (e) {
        toast.error('Failed to load SQL engine')
      }
    }
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  const runQuery = async () => {
    if (!db) { toast.error('SQL engine not loaded yet'); return }
    setRunning(true)
    setError(null)
    setResults(null)

    try {
      // Handle multiple statements
      const statements = query.split(';').map(s => s.trim()).filter(s => s && !s.startsWith('--') && s !== '.tables')
      let lastResult = null

      for (const stmt of statements) {
        if (!stmt) continue
        try {
          const res = db.exec(stmt)
          if (res.length > 0) lastResult = res[0]
        } catch (e) {
          setError(e.message)
          setRunning(false)
          return
        }
      }

      if (lastResult) {
        setResults(lastResult)
        toast.success(`Query executed! ${lastResult.values.length} rows returned.`)
      } else {
        toast.success('Query executed successfully!')
        setResults({ columns: ['Status'], values: [['Query executed. No rows returned (or used INSERT/UPDATE/DELETE).']] })
      }

      // Track progress
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'sql_run', details: { subject: 'Database', topic: 'SQL Practice', duration: 2 } })
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setRunning(false)
    }
  }

  const loadPreset = (preset) => {
    setQuery(preset.query)
    setSelectedPreset(preset.label)
    setResults(null)
    setError(null)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-600" /> SQL Practice
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Practice SQL queries right in your browser — no setup needed!
            {!dbLoaded && <span className="ml-2 text-orange-500">⏳ Loading SQL engine...</span>}
            {dbLoaded && <span className="ml-2 text-green-500">✅ SQL engine ready</span>}
          </p>
        </div>
      </div>

      {/* Preset queries */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <h3 className="font-medium text-slate-700 text-sm mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Quick Examples (Click to load)
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUERIES.map(p => (
            <button key={p.label} onClick={() => loadPreset(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                selectedPreset === p.label
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50 hover:border-purple-300'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-3 border-b bg-slate-50 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">SQL Editor</span>
          <div className="flex gap-2">
            <button onClick={() => { setQuery(''); setResults(null); setError(null) }}
              className="flex items-center gap-1 px-3 py-1.5 text-slate-600 bg-white border border-slate-200 rounded-lg text-xs hover:bg-slate-50">
              <RefreshCw className="w-3 h-3" /> Clear
            </button>
            <button onClick={runQuery} disabled={running || !dbLoaded}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg text-xs font-medium transition-colors">
              {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              {running ? 'Running...' : 'Run Query'}
            </button>
          </div>
        </div>
        <div className="monaco-container">
          <MonacoEditor
            height="250px"
            language="sql"
            value={query}
            onChange={setQuery}
            theme="vs-dark"
            options={{ fontSize: 14, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, automaticLayout: true, fontFamily: "'Fira Code', monospace" }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-red-700 text-sm font-medium mb-1">❌ SQL Error:</p>
          <code className="text-red-600 text-sm">{error}</code>
          <p className="text-red-500 text-xs mt-2">💡 Check your SQL syntax and try again</p>
        </div>
      )}

      {/* Results table */}
      {results && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-3 border-b bg-slate-50 flex items-center gap-2">
            <Table className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">
              Results — {results.values.length} row{results.values.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-purple-50">
                  {results.columns.map(col => (
                    <th key={col} className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase tracking-wide border-b">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.values.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2 text-slate-700 border-b border-slate-100 font-mono">
                        {cell === null ? <span className="text-slate-400 italic">NULL</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SQL Reference */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { cmd: 'SELECT * FROM table', desc: 'Get all rows' },
          { cmd: 'WHERE col = value', desc: 'Filter rows' },
          { cmd: 'ORDER BY col DESC', desc: 'Sort results' },
          { cmd: 'GROUP BY col', desc: 'Group rows' },
          { cmd: 'COUNT(*)', desc: 'Count rows' },
          { cmd: 'AVG(col)', desc: 'Average value' },
          { cmd: 'INSERT INTO...', desc: 'Add row' },
          { cmd: 'UPDATE...SET...', desc: 'Modify row' },
        ].map(({ cmd, desc }) => (
          <div key={cmd} className="bg-white rounded-xl p-3 border border-slate-100">
            <code className="text-purple-700 text-xs font-mono block mb-1">{cmd}</code>
            <p className="text-slate-500 text-xs">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
