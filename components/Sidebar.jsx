'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard, BookOpen, Code2, Database, ClipboardList,
  Video, Trophy, Users, Settings, LogOut, ChevronRight,
  BarChart2, Brain, Cpu
} from 'lucide-react'

const studentNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/notes', icon: BookOpen, label: 'Study Notes' },
  { href: '/practice', icon: Code2, label: 'Python Practice' },
  { href: '/sql', icon: Database, label: 'SQL Practice' },
  { href: '/tests', icon: ClipboardList, label: 'Tests & Exams' },
  { href: '/classes', icon: Video, label: 'Live Classes' },
  { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/ai-tools', icon: Brain, label: 'AI Tools (Class X)' },
]

const adminNav = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/students', icon: Users, label: 'Students' },
  { href: '/admin/notes', icon: BookOpen, label: 'Notes & Topics' },
  { href: '/admin/tests', icon: ClipboardList, label: 'Tests' },
  { href: '/admin/classes', icon: Video, label: 'Live Classes' },
  { href: '/admin/monitoring', icon: BarChart2, label: 'Monitoring' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const nav = isAdmin ? adminNav : studentNav

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-brand-900 text-white flex flex-col z-40">
      <div className="p-5 border-b border-brand-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-saffron-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-sm leading-tight">Chinmaya Vidyalaya</p>
            <p className="text-brand-300 text-xs">NTPC Unchahar</p>
          </div>
        </div>
      </div>
      <div className="p-4 border-b border-brand-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-saffron-500/30 border border-saffron-400/40 flex items-center justify-center text-sm font-bold text-saffron-300 flex-shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
            <p className="text-brand-400 text-xs">
              {isAdmin ? '👨‍🏫 Shivam Tiwari Sir' : `Class ${session?.user?.class} • Roll ${session?.user?.rollNumber}`}
            </p>
          </div>
        </div>
      </div>
      {!isAdmin && (
        <div className="mx-3 mt-3 px-3 py-1.5 bg-brand-800 rounded-xl">
          <p className="text-xs text-brand-300 text-center">
            {session?.user?.class === 'XII' ? '📘 Class XII — Python, Networks, DB' : '🤖 Class X — AI & Computer Science'}
          </p>
        </div>
      )}
      <nav className="flex-1 p-3 overflow-y-auto mt-1">
        <div className="space-y-0.5">
          {nav.map(({ href, icon: Icon, label }) => {
            const isActive = href === '/admin' || href === '/dashboard'
              ? pathname === href
              : pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive ? 'bg-brand-700 text-white shadow-sm' : 'text-brand-300 hover:bg-brand-800 hover:text-white'
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="p-3 border-t border-brand-800">
        <button onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brand-400 hover:bg-red-900/30 hover:text-red-300 transition-all">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <p className="text-center text-brand-600 text-xs mt-2">Made with ❤️ for students</p>
      </div>
    </aside>
  )
}
