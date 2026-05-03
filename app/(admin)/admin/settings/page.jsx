'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Settings, Lock, Globe, Users, Shield, Loader2, Save } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({ enrollmentOpen: false, openToPublic: false })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { setSettings(d); setLoading(false) })
  }, [])

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    if (res.ok) toast.success('Settings saved!')
    else toast.error('Failed to save')
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-600" /> Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Control platform access and enrollment</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Enrollment control */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">New Enrollment</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    When OFF, only admin can add students (bulk or manual).<br />
                    When ON, a self-registration link will be available.
                  </p>
                  <p className="text-orange-600 text-xs mt-2">
                    ⚠️ Currently: Only admin-added students can login
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input type="checkbox" checked={settings.enrollmentOpen}
                  onChange={e => setSettings(s => ({ ...s, enrollmentOpen: e.target.checked }))}
                  className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>
          </div>

          {/* Public access */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Open to Public</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    For <strong>future use</strong>: Allow students from other schools to register.<br />
                    Currently keep this OFF to limit access to Chinmaya Vidyalaya only.
                  </p>
                  {settings.openToPublic && (
                    <p className="text-green-600 text-xs mt-2 bg-green-50 px-3 py-1.5 rounded-lg inline-block">
                      🌍 Platform is open — anyone can register
                    </p>
                  )}
                  {!settings.openToPublic && (
                    <p className="text-blue-600 text-xs mt-2 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">
                      🔒 Private mode — Chinmaya Vidyalaya students only
                    </p>
                  )}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input type="checkbox" checked={settings.openToPublic}
                  onChange={e => setSettings(s => ({ ...s, openToPublic: e.target.checked }))}
                  className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>
          </div>

          {/* Security notice */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-700 text-sm">Security Notes</h4>
                <ul className="text-slate-500 text-sm mt-2 space-y-1">
                  <li>• All student passwords are encrypted (bcrypt)</li>
                  <li>• Sessions expire after 30 days</li>
                  <li>• All API routes are authenticated</li>
                  <li>• Admin routes are role-protected</li>
                  <li>• MongoDB Atlas uses IP whitelisting</li>
                </ul>
              </div>
            </div>
          </div>

          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white rounded-xl font-medium">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Settings</>}
          </button>
        </div>
      )}
    </div>
  )
}
