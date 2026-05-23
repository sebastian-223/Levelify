import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react'
import { useTimerStore } from '@/store/otherStores'
import { Card, StatCard } from '@/components/ui/index'
import { TIMER_MODES } from '@/constants/categories'
import { formatSeconds, formatHours, cn } from '@/utils/index'
import { toast } from 'sonner'

export default function TimerPage() {
  const [mode, setMode] = useState('focus')
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.focus.duration)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const { addSession, totalFocusSeconds, sessions: sessionLog } = useTimerStore()
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  const currentMode = TIMER_MODES[mode]
  const progress = (timeLeft / currentMode.duration) * 100

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
  }, [])

  const complete = useCallback(() => {
    stop()
    const elapsed = currentMode.duration - timeLeft
    if (elapsed > 30) {
      addSession({ mode, label: currentMode.label, durationSeconds: elapsed })
      setSessions(s => s + 1)
      toast.success(`${currentMode.emoji} ${currentMode.label} session complete! Great work!`)
    }
    setTimeLeft(currentMode.duration)
  }, [stop, currentMode, timeLeft, mode, addSession])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { complete(); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, complete])

  const handleMode = (m) => {
    stop()
    setMode(m)
    setTimeLeft(TIMER_MODES[m].duration)
  }

  const toggle = () => setIsRunning(r => !r)
  const reset = () => { stop(); setTimeLeft(currentMode.duration) }

  const circumference = 2 * Math.PI * 120
  const dashoffset = circumference * (1 - progress / 100)

  const todaySessions = sessionLog.filter(s => new Date(s.completedAt).toDateString() === new Date().toDateString())

  return (
    <div className="page-wrapper max-w-2xl mx-auto">
      <div className="flex flex-col items-center gap-6">
        {/* Mode selector */}
        <div className="flex gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-2xl">
          {Object.entries(TIMER_MODES).map(([key, m]) => (
            <button key={key} onClick={() => handleMode(key)}
              className={cn('px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                mode === key ? 'bg-white dark:bg-surface-card-dark text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200')}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        {/* Timer circle */}
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
          <svg width="300" height="300" className="transform -rotate-90">
            <circle cx="150" cy="150" r="120" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-100 dark:text-gray-800" />
            <motion.circle
              cx="150" cy="150" r="120"
              stroke="url(#timerGrad)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: dashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p
              key={timeLeft}
              className="text-5xl font-bold text-gray-900 dark:text-white font-mono tracking-tight"
            >
              {formatSeconds(timeLeft)}
            </motion.p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentMode.emoji} {currentMode.label}</p>
            {isRunning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex items-center gap-1.5 text-xs text-green-500">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />Running
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={reset} className="p-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center shadow-glow-primary transition-all"
          >
            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </motion.button>
          <button onClick={complete} className="p-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 transition-colors">
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Today stats */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {[
            { label: "Today's Sessions", value: todaySessions.length },
            { label: 'Total Focus Time', value: formatHours(totalFocusSeconds) },
            { label: 'Sessions Logged', value: sessionLog.length },
          ].map((s, i) => (
            <Card key={i} className="p-4 text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Recent sessions */}
        {todaySessions.length > 0 && (
          <Card className="w-full p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Today's Sessions</h3>
            <div className="space-y-2">
              {todaySessions.slice(0, 5).map(s => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{s.label}</span>
                  <span className="text-gray-500">{formatHours(s.durationSeconds)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
