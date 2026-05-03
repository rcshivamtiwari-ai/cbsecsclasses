'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Users, Plus, Upload, Search, Eye, Trash2, X, Loader2, Download, AlertCircle } from 'lucide-react'

const defaultForm = { name: '', email: '', password: '', class: 'XII', rollNumber: '', section: 'A', fatherName: '', phone: '', village: '', distanceFromSchool: '' }

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [filter, setFilter] = useState({ search: '', class: 'All' })
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [csvText, setCsvText] = useState('')
  const [showBulk, setShowBulk] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { loadStudents() }, [])

  const loadStudents = async () => {
    const res = await fetch('/api/students')
    const data = await res.json()
    setStudents(data.students || [])
  }

  const addStudent = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.rollNumber) {
      toast.error('Fill all required fields')
      return
    }
    setSaving(true)
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      toast.success('Student added!')
      setShowAdd(false)
      setForm(defaultForm)
      loadStudents()
    } else {
      toast.error(data.error || 'Failed to add student')
    }
  }

  const bulkUpload = async () => {
    if (!csvText.trim()) { toast.error('Paste CSV data first'); return }
    setUploading(true)
    try {
      const lines = csvText.trim().split('\n').slice(1) // skip header
      const students = lines.map(line => {
        const [name, email, class_, rollNumber, section, fatherName, phone, village, distance] = line.split(',').map(s => s.trim())
        return { name, email, class: class_, rollNumber, section: section || 'A', fatherName, phone, village, distanceFromSchool: Number(distance) || 0 }
      }).filter(s => s.name && s.email)

      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students }),
      })
      const data = await res.json()
      toast.success(`✅ ${data.success} added, ${data.failed} failed`)
      setShowBulk(false)
      setCsvText('')
      loadStudents()
    } catch (e) {
      toast.error('Failed to parse CSV')
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csv = 'name,email,class,rollNumber,section,fatherName,phone,village,distanceFromSchool\nRahul Sharma,rahul@example.com,XII,001,A,Ramesh Sharma,9876543210,Unchahar,5\nPriya Singh,priya@example.com,X,002,A,Suresh Singh,9876543211,Raebareli,40'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'students_template.csv'; a.click()
  }

  const filtered = students.filter(s => {
    const matchClass = filter.class === 'All' || s.class === filter.class
    const matchSearch = !filter.search ||
      s.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      s.rollNumber.includes(filter.search) ||
      s.email.includes(filter.search.toLowerCase())
    return matchClass && matchSearch
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Students
          </h1>
          <p className="text-slate-500 text-sm">{students.length} total students enrolled</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBulk(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
            placeholder="Search by name, roll, email..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
        </div>
        {['All', 'X', 'XII'].map(c => (
          <button key={c} onClick={() => setFilter(f => ({ ...f, class: c }))}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter.class === c ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>{c === 'All' ? 'All Classes' : `Class ${c}`}</button>
        ))}
      </div>

      {/* Students table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Roll No', 'Name', 'Class', 'Email', 'Village', 'Distance', 'Last Login', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">No students found</td></tr>
              ) : (
                filtered.map(s => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm text-slate-600">{s.rollNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-bold flex-shrink-0">
                          {s.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.fatherName || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded-full">Class {s.class}{s.section}</span></td>
                    <td className="px-4 py-3 text-sm text-slate-600 truncate max-w-40">{s.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{s.village || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{s.distanceFromSchool ? `${s.distanceFromSchool} km` : '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {s.lastLogin ? new Date(s.lastLogin).toLocaleDateString('en-IN') : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-display font-bold text-slate-800">Add New Student</h2>
              <button onClick={() => setShowAdd(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={addStudent} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'name', label: 'Full Name*', placeholder: 'Rahul Sharma' },
                  { key: 'email', label: 'Email*', placeholder: 'rahul@example.com', type: 'email' },
                  { key: 'password', label: 'Password*', placeholder: 'Min 6 characters', type: 'password' },
                  { key: 'rollNumber', label: 'Roll Number*', placeholder: '001' },
                  { key: 'fatherName', label: "Father's Name", placeholder: 'Ramesh Sharma' },
                  { key: 'phone', label: 'Phone', placeholder: '9876543210' },
                  { key: 'village', label: 'Village/Town', placeholder: 'Unchahar' },
                  { key: 'distanceFromSchool', label: 'Distance (km)', placeholder: '5', type: 'number' },
                ].map(({ key, label, placeholder, type = 'text' }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">{label}</label>
                    <input type={type} placeholder={placeholder}
                      value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Class*</label>
                  <select value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="X">Class X</option>
                    <option value="XII">Class XII</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Section</label>
                  <input value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                    placeholder="A"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:bg-brand-300 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-display font-bold text-slate-800">Bulk Upload Students</h2>
              <button onClick={() => setShowBulk(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-600 text-sm">Paste your CSV data below (or use the template)</p>
                <button onClick={downloadTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-brand-600 border border-brand-200 rounded-xl text-sm hover:bg-brand-50">
                  <Download className="w-4 h-4" /> Download Template
                </button>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border text-xs text-slate-500 font-mono">
                name,email,class,rollNumber,section,fatherName,phone,village,distanceFromSchool
              </div>
              <textarea value={csvText} onChange={e => setCsvText(e.target.value)}
                placeholder="Paste CSV data here..."
                rows={8}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-700 text-xs">Default password will be: rollNumber@Vidyalaya (e.g., 001@Vidyalaya). Students must change it later.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowBulk(false)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={bulkUpload} disabled={uploading}
                  className="flex-1 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:bg-brand-300 flex items-center justify-center gap-2">
                  {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : '📤 Upload All'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
