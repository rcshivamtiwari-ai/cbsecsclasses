'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Video, Plus, Play, Square, Calendar, Clock, Users, Copy, X, Loader2, ExternalLink } from 'lucide-react'

const defaultForm = { title: '', description: '', class: 'XII', subject: 'Python', topic: '', scheduledAt: '', duration: 60 }

export default function AdminClasses() {
  const [classes, setClasses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadClasses() }, [])

  const loadClasses = async () => {
    const res = await fetch('/api/classes')
    const data = await res.json()
    setClasses(data.classes || [])
  }

  const createClass = async (e) => {
    e.preventDefault()
    if (!form.title || !form.scheduledAt) { toast.error('Fill required fields'); return }
    setSaving(true)
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      toast.success('Class scheduled!')
      setShowForm(false); setForm(defaultForm); loadClasses()
    } else toast.error('Failed to schedule class')
  }

  const updateStatus = async (classId, action) => {
    await fetch('/api/classes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId, action }),
    })
    toast.success(action === 'start' ? 'Class started! 🔴 LIVE' : 'Class ended')
    loadClasses()
  }

  const copyLink = (meetingId) => {
    const link = `https://meet.jit.si/${meetingId}`
    navigator.clipboard.writeText(link)
    toast.success('Meeting link copied!')
  }

  const openMeeting = (meetingId) => {
    window.open(`https://meet.jit.si/${meetingId}`, '_blank')
  }

  const statusColor = { scheduled: 'bg-blue-100 text-blue-700', live: 'bg-red-100 text-red-700', ended: 'bg-slate-100 text-slate-500' }
  const formatDate = (d) => new Date(d).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Video className="w-6 h-6 text-red-500" /> Live Classes
          </h1>
          <p className="text-slate-500 text-sm">Schedule and manage live classes via Jitsi Meet (free)</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> Schedule Class
        </button>
      </div>

      <div className="bg-brand-50 rounded-2xl p-4 border border-brand-100">
        <p className="text-brand-800 text-sm">
          📡 <strong>Jitsi Meet</strong> is 100% free. No account needed. Classes are conducted at <strong>meet.jit.si</strong>.
          Students join directly from the platform. You can record sessions using the Jitsi record button.
        </p>
      </div>

      <div className="space-y-3">
        {classes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Video className="w-16 h-16 mx-auto mb-4 text-slate-200" />
            <p className="text-slate-500">No classes scheduled. Create your first live class!</p>
          </div>
        ) : classes.map(cls => (
          <div key={cls._id} className={`bg-white rounded-2xl border p-5 ${cls.status === 'live' ? 'border-red-200 bg-red-50/30' : 'border-slate-100'}`}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-slate-800">{cls.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[cls.status]}`}>
                    {cls.status === 'live' ? '🔴 LIVE' : cls.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-500 text-sm">{cls.subject}{cls.topic ? ` • ${cls.topic}` : ''} • Class {cls.class}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(cls.scheduledAt)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cls.duration} min</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{cls.attendees?.length || 0} students joined</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded">{cls.meetingId}</span>
                  <button onClick={() => copyLink(cls.meetingId)}
                    className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy link
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openMeeting(cls.meetingId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-700 rounded-xl text-xs hover:bg-brand-100">
                  <ExternalLink className="w-3 h-3" /> Open Jitsi
                </button>
                {cls.status === 'scheduled' && (
                  <button onClick={() => updateStatus(cls._id, 'start')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs">
                    <Play className="w-3 h-3" /> Start Class
                  </button>
                )}
                {cls.status === 'live' && (
                  <button onClick={() => updateStatus(cls._id, 'end')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs">
                    <Square className="w-3 h-3" /> End Class
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule class modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-display font-bold text-slate-800">Schedule Live Class</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={createClass} className="p-5 space-y-3">
              {[
                { key: 'title', label: 'Class Title *', placeholder: 'e.g., Functions in Python - Chapter 2' },
                { key: 'description', label: 'Description', placeholder: 'What will be covered...' },
                { key: 'topic', label: 'Topic', placeholder: 'e.g., Default Parameters, Recursion' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">{label}</label>
                  <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Class *</label>
                  <select value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="X">Class X</option>
                    <option value="XII">Class XII</option>
                    <option value="Both">Both Classes</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Subject *</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    {['Python','Networks','Database','AI','General'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Date & Time *</label>
                  <input type="datetime-local" value={form.scheduledAt}
                    onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Duration (minutes)</label>
                  <input type="number" value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:bg-brand-300 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Scheduling...</> : '📅 Schedule Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
