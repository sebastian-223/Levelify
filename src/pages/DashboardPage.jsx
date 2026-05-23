import { useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Code2, Flame, Award, Clock, Target, TrendingUp, BookOpen, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useDSAStore } from '@/store/dsaStore'
import { useStreakStore } from '@/store/otherStores'
import { useCertStore } from '@/store/otherStores'
import { useTimerStore } from '@/store/otherStores'
import { useNotesStore } from '@/store/notesStore'
import { StatCard, Card, ProgressBar } from '@/components/ui/index'
import { formatHours } from '@/utils/index'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const stagger = { animate: { transition: { staggerChildren: 0.07 } } }
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const weeklyData = [
  { day: 'Mon', problems: 3, hours: 2 },
  { day: 'Tue', problems: 5, hours: 3 },
  { day: 'Wed', problems: 2, hours: 1.5 },
  { day: 'Thu', problems: 7, hours: 4 },
  { day: 'Fri', problems: 4, hours: 2.5 },
  { day: 'Sat', problems: 8, hours: 5 },
  { day: 'Sun', problems: 3, hours: 2 },
]

const quickLinks = [
  { label: 'DSA Tracker', to: '/dsa', icon: Code2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { label: 'Roadmap',     to: '/roadmap', icon: Target, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { label: 'AI Assistant', to: '/ai', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { label: 'Study Timer', to: '/timer', icon: Clock, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
]

export default function DashboardPage() {
  const user = useAuthStore(s => s.user)
  const dsaStats = useDSAStore(s => s.getStats())
  const currentStreak = useStreakStore(s => s.getCurrentStreak())
  const longestStreak = useStreakStore(s => s.getLongestStreak())
  const { logActivity } = useStreakStore()
  const certs = useCertStore(s => s.certs)
  const totalFocusSeconds = useTimerStore(s => s.totalFocusSeconds)
  const notes = useNotesStore(s => s.notes)

  useEffect(() => {
    // Log daily visit as activity
    logActivity()
  }, [])

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  return (
    <div className="page-wrapper">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {greeting}, {user?.name?.split(' ')[0] || 'Learner'} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here's your learning summary. Keep the streak alive!
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div variants={fadeUp}><StatCard label="DSA Solved" value={dsaStats.total} icon={Code2} color="blue" trend="+3 this week" /></motion.div>
        <motion.div variants={fadeUp}><StatCard label="Day Streak" value={currentStreak} icon={Flame} color="amber" trend={`Best: ${longestStreak}`} /></motion.div>
        <motion.div variants={fadeUp}><StatCard label="Focus Time" value={formatHours(totalFocusSeconds)} icon={Clock} color="green" /></motion.div>
        <motion.div variants={fadeUp}><StatCard label="Certifications" value={certs.length} icon={Award} color="purple" /></motion.div>
      </motion.div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white">Weekly Progress</h2>
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">This week</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a28', border: '1px solid #2a2a40', borderRadius: 10, fontSize: 12 }} labelStyle={{ color: '#e5e7eb' }} />
                <Area type="monotone" dataKey="problems" stroke="#6366f1" strokeWidth={2} fill="url(#gradProblems)" name="Problems" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* DSA breakdown */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="p-5">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-500" /> DSA Breakdown
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Easy', count: dsaStats.easy, total: dsaStats.total || 1, color: 'green' },
                  { label: 'Medium', count: dsaStats.medium, total: dsaStats.total || 1, color: 'amber' },
                  { label: 'Hard', count: dsaStats.hard, total: dsaStats.total || 1, color: 'red' },
                ].map(({ label, count, total, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{label}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                    <ProgressBar value={count} max={total} color={color} size="sm" />
                  </div>
                ))}
              </div>
              {dsaStats.total === 0 && (
                <p className="text-xs text-gray-400 text-center mt-3">No problems logged yet</p>
              )}
            </Card>
          </motion.div>

          {/* Quick links */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-5">
              <h2 className="font-bold text-gray-900 dark:text-white mb-3">Quick Access</h2>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map(({ label, to, icon: Icon, color, bg }) => (
                  <Link key={to} to={to}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                  >
                    <div className={`p-2 rounded-xl ${bg} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{label}</span>
                  </Link>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Notes + Certs summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-500" /> Recent Notes
              </h2>
              <Link to="/notes" className="text-xs text-primary-500 hover:underline">View all</Link>
            </div>
            {notes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No notes yet. Start capturing ideas!</p>
            ) : (
              <div className="space-y-2">
                {notes.slice(0, 3).map(note => (
                  <div key={note.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <span className="text-base">{note.isPinned ? '📌' : '📝'}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{note.title}</p>
                      <p className="text-xs text-gray-400">{note.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" /> Certifications
              </h2>
              <Link to="/certs" className="text-xs text-primary-500 hover:underline">View all</Link>
            </div>
            {certs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No certifications tracked yet</p>
            ) : (
              <div className="space-y-2">
                {certs.slice(0, 3).map(cert => (
                  <div key={cert.id} className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{cert.name}</p>
                      <span className="text-xs text-gray-400">{cert.progress}%</span>
                    </div>
                    <ProgressBar value={cert.progress} max={100} size="sm" color={cert.progress === 100 ? 'green' : 'primary'} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
