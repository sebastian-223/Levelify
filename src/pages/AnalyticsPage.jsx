import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useDSAStore } from '@/store/dsaStore'
import { useTimerStore } from '@/store/otherStores'
import { useNotesStore } from '@/store/notesStore'
import { useResourcesStore } from '@/store/resourcesStore'
import { Card, StatCard } from '@/components/ui/index'
import { BarChart3, Code2, Clock, BookOpen } from 'lucide-react'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  )
  return null
}

export default function AnalyticsPage() {
  const problems = useDSAStore(s => s.problems)
  const getStats = useDSAStore(s => s.getStats)
  const sessions = useTimerStore(s => s.sessions)
  const totalFocusSeconds = useTimerStore(s => s.totalFocusSeconds)
  const notes = useNotesStore(s => s.notes)
  const resources = useResourcesStore(s => s.resources)
  const stats = getStats()

  const dsaDifficultyData = useMemo(() => [
    { name: 'Easy', value: stats.easy, color: '#10b981' },
    { name: 'Medium', value: stats.medium, color: '#f59e0b' },
    { name: 'Hard', value: stats.hard, color: '#ef4444' },
  ].filter(d => d.value > 0), [stats])

  const topicData = useMemo(() => {
    const counts = {}
    problems.forEach(p => { counts[p.topic] = (counts[p.topic] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([topic, count]) => ({ topic: topic.length > 10 ? topic.slice(0, 10) + '..' : topic, count }))
  }, [problems])

  const weeklySessionData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map(day => ({
      day,
      sessions: sessions.filter(s => {
        const d = new Date(s.completedAt)
        return d.toLocaleDateString('en-US', { weekday: 'short' }) === day
      }).length
    }))
  }, [sessions])

  const noteCategoryData = useMemo(() => {
    const counts = {}
    notes.forEach(n => { counts[n.category] = (counts[n.category] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [notes])

  return (
    <div className="page-wrapper">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total DSA Solved', value: stats.total, icon: Code2, color: 'blue' },
          { label: 'Focus Sessions', value: sessions.length, icon: Clock, color: 'green' },
          { label: 'Notes Created', value: notes.length, icon: BookOpen, color: 'amber' },
          { label: 'Resources Saved', value: resources.length, icon: BarChart3, color: 'purple' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* DSA by topic */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">DSA by Topic</h2>
            {topicData.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No problems logged yet</p> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topicData} margin={{ left: -20, bottom: 0 }}>
                  <XAxis dataKey="topic" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Problems" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </motion.div>

        {/* DSA difficulty pie */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Difficulty Distribution</h2>
            {dsaDifficultyData.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No problems logged yet</p> : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={dsaDifficultyData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" nameKey="name">
                    {dsaDifficultyData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </motion.div>

        {/* Weekly sessions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Study Sessions</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklySessionData} margin={{ left: -20 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Notes by category */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Notes by Category</h2>
            {noteCategoryData.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No notes yet</p> : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={noteCategoryData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value" nameKey="name">
                    {noteCategoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
