'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Trophy, Medal, Star, TrendingUp, Users } from 'lucide-react'

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const [leaderboard, setLeaderboard] = useState([])
  const [cls, setCls] = useState(session?.user?.class || 'XII')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/progress?type=leaderboard&class=${cls}`)
      .then(r => r.json())
      .then(d => { setLeaderboard(d.leaderboard || []); setLoading(false) })
  }, [cls])

  const myRank = leaderboard.findIndex(e => e.student?.rollNumber === session?.user?.rollNumber) + 1

  const rankIcon = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const rankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200'
    if (rank === 2) return 'bg-slate-50 border-slate-200'
    if (rank === 3) return 'bg-orange-50 border-orange-200'
    return 'bg-white border-slate-100'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" /> Class Leaderboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">Based on average test scores • Keep learning to climb up! 🚀</p>
        </div>
        <div className="flex gap-2">
          {['X', 'XII'].map(c => (
            <button key={c} onClick={() => setCls(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                cls === c ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>Class {c}</button>
          ))}
        </div>
      </div>

      {/* My rank card */}
      {myRank > 0 && (
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-5 text-white">
          <p className="text-brand-200 text-sm">Your Position</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-5xl font-display font-black">{rankIcon(myRank)}</div>
            <div>
              <p className="font-display font-bold text-xl">{session?.user?.name}</p>
              <p className="text-brand-200 text-sm">
                Avg Score: {leaderboard[myRank-1]?.avgScore || 0}% •
                Tests: {leaderboard[myRank-1]?.tests || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 podium */}
      {!loading && leaderboard.length >= 3 && (
        <div className="flex items-end justify-center gap-4 py-4">
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, i) => {
            const heights = ['h-24', 'h-32', 'h-20']
            const positions = [2, 1, 3]
            const colors = ['bg-slate-200', 'bg-yellow-300', 'bg-orange-200']
            return (
              <div key={entry?.student?._id} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700">
                  {entry?.student?.name?.[0]}
                </div>
                <p className="text-xs font-medium text-slate-700 text-center max-w-16 truncate">{entry?.student?.name?.split(' ')[0]}</p>
                <p className="text-xs font-bold text-slate-600">{entry?.avgScore}%</p>
                <div className={`w-20 ${heights[i]} ${colors[i]} rounded-t-xl flex items-center justify-center`}>
                  <span className="text-2xl font-display font-black text-slate-600">{positions[i]}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full leaderboard */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl border border-slate-100 animate-pulse" />)}
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Users className="w-16 h-16 mx-auto mb-4 text-slate-200" />
          <p className="text-slate-500 font-medium">No data yet</p>
          <p className="text-slate-400 text-sm">Take tests to appear on the leaderboard!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, i) => {
            const isMe = entry.student?.rollNumber === session?.user?.rollNumber
            return (
              <div key={entry.student?._id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${rankColor(i+1)} ${isMe ? 'ring-2 ring-brand-500' : ''}`}>
                <div className="w-10 text-center font-display font-bold text-lg text-slate-600">
                  {rankIcon(i+1)}
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 flex-shrink-0">
                  {entry.student?.name?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800 text-sm">
                    {entry.student?.name}
                    {isMe && <span className="ml-2 text-xs bg-brand-100 text-brand-600 px-2 py-0.5 rounded-full">You</span>}
                  </p>
                  <p className="text-slate-400 text-xs">Roll {entry.student?.rollNumber} • {entry.tests} test{entry.tests !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-right">
                  <p className={`font-display font-bold text-lg ${
                    entry.avgScore >= 80 ? 'text-green-600' : entry.avgScore >= 60 ? 'text-yellow-600' : 'text-slate-600'
                  }`}>{entry.avgScore}%</p>
                  <p className="text-slate-400 text-xs">avg score</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
