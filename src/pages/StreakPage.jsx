import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Trophy, Calendar, TrendingUp } from 'lucide-react'
import { useStreakStore } from '@/store/otherStores'
import { Card, StatCard } from '@/components/ui/index'
import { generateHeatmapData, getHeatmapColor, cn } from '@/utils/index'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function StreakPage() {
  const { activityLog, getCurrentStreak, getLongestStreak } = useStreakStore()
  const currentStreak = getCurrentStreak()
  const longestStreak = getLongestStreak()
  const totalDays = Object.keys(activityLog).length
  const heatmapData = useMemo(() => generateHeatmapData(activityLog, 26), [activityLog])

  const monthLabels = useMemo(() => {
    const labels = []
    heatmapData.forEach((week, wi) => {
      const firstDay = new Date(week[0].date)
      if (firstDay.getDate() <= 7) {
        labels.push({ week: wi, month: MONTHS[firstDay.getMonth()] })
      }
    })
    return labels
  }, [heatmapData])

  return (
    <div className="page-wrapper">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Current Streak', value: currentStreak, icon: Flame, color: 'amber', suffix: ' days' },
          { label: 'Longest Streak', value: longestStreak, icon: Trophy, color: 'purple', suffix: ' days' },
          { label: 'Active Days', value: totalDays, icon: Calendar, color: 'blue' },
          { label: 'This Month', value: Object.keys(activityLog).filter(d => new Date(d).getMonth() === new Date().getMonth()).length, icon: TrendingUp, color: 'green' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Heatmap */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 dark:text-white">Activity Heatmap</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Less</span>
              {[0, 1, 2, 4, 7].map(n => (
                <div key={n} className={cn('w-3 h-3 rounded-sm', getHeatmapColor(n))} />
              ))}
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {/* Day labels */}
              <div className="flex flex-col gap-1 mr-1 pt-5">
                {DAYS.map((d, i) => (
                  <div key={d} className="h-3 flex items-center">
                    {i % 2 === 1 && <span className="text-[10px] text-gray-400 w-7">{d}</span>}
                    {i % 2 === 0 && <span className="w-7" />}
                  </div>
                ))}
              </div>

              {/* Month labels + grid */}
              <div>
                {/* Month labels */}
                <div className="flex gap-1 mb-1">
                  {heatmapData.map((_, wi) => {
                    const label = monthLabels.find(l => l.week === wi)
                    return (
                      <div key={wi} className="w-3 text-[10px] text-gray-400">
                        {label?.month || ''}
                      </div>
                    )
                  })}
                </div>

                {/* Grid */}
                <div className="flex gap-1">
                  {heatmapData.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                      {week.map(day => (
                        <div
                          key={day.date}
                          title={`${day.date}: ${day.count} activity${day.count !== 1 ? 'ies' : 'y'}`}
                          className={cn('w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer', getHeatmapColor(day.count))}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Motivational card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-5">
        <Card glass className="p-6 text-center">
          <div className="text-4xl mb-3">
            {currentStreak >= 30 ? '🏆' : currentStreak >= 14 ? '🔥' : currentStreak >= 7 ? '⚡' : currentStreak >= 1 ? '💪' : '🌱'}
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">
            {currentStreak === 0 ? 'Start your streak today!' :
             currentStreak === 1 ? 'Day 1 — Great start!' :
             currentStreak < 7 ? `${currentStreak} day streak — Keep going!` :
             currentStreak < 30 ? `${currentStreak} day streak — You're on fire! 🔥` :
             `${currentStreak} day streak — Legend status! 🏆`}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentStreak === 0
              ? 'Log a DSA problem or start a study session to begin your streak.'
              : `Maintain consistency. ${longestStreak > currentStreak ? `Your best was ${longestStreak} days — beat it!` : 'This is your best streak ever!'}`}
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
