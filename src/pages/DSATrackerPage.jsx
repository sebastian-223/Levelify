import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Trash2, RotateCcw, ExternalLink, Code2, Filter } from 'lucide-react'
import { useDSAStore } from '@/store/dsaStore'
import { useStreakStore } from '@/store/otherStores'
import { useDebounce } from '@/hooks/index'
import { Card, Button, Modal, Input, Select, Badge, StatCard, EmptyState } from '@/components/ui/index'
import { DSA_TOPICS, DSA_PLATFORMS } from '@/constants/categories'
import { formatDate } from '@/utils/index'
import { toast } from 'sonner'

const DIFFICULTIES = ['easy', 'medium', 'hard']

const diffColor = { easy: 'green', medium: 'amber', hard: 'red' }

const EMPTY_FORM = { title: '', platform: 'LeetCode', difficulty: 'easy', topic: 'Arrays', link: '', notes: '' }

export default function DSATrackerPage() {
  const { problems, addProblem, deleteProblem, toggleRevision, getStats } = useDSAStore()
  const { logActivity } = useStreakStore()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [filterDiff, setFilterDiff] = useState('all')
  const [filterTopic, setFilterTopic] = useState('all')
  const debouncedSearch = useDebounce(search)
  const stats = getStats()

  const filtered = useMemo(() => {
    return problems.filter(p => {
      const matchSearch = !debouncedSearch || p.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.topic?.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchDiff = filterDiff === 'all' || p.difficulty === filterDiff
      const matchTopic = filterTopic === 'all' || p.topic === filterTopic
      return matchSearch && matchDiff && matchTopic
    })
  }, [problems, debouncedSearch, filterDiff, filterTopic])

  const handleAdd = () => {
    if (!form.title.trim()) { toast.error('Problem title is required'); return }
    addProblem(form)
    logActivity()
    setForm(EMPTY_FORM)
    setShowModal(false)
    toast.success('Problem logged! 💪')
  }

  return (
    <div className="page-wrapper">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Solved', value: stats.total, icon: Code2, color: 'blue' },
          { label: 'Easy', value: stats.easy, icon: Code2, color: 'green' },
          { label: 'Medium', value: stats.medium, icon: Code2, color: 'amber' },
          { label: 'Hard', value: stats.hard, icon: Code2, color: 'red' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <Card className="p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              placeholder="Search problems..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
            />
          </div>
          <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/30">
            <option value="all">All Difficulties</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
          <select value={filterTopic} onChange={e => setFilterTopic(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/30">
            <option value="all">All Topics</option>
            {DSA_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Problem
          </Button>
        </div>
      </Card>

      {/* Problems list */}
      {filtered.length === 0 ? (
        <EmptyState icon="💻" title="No problems found" description="Start logging your DSA solutions to track your progress." action={<Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add First Problem</Button>} />
      ) : (
        <div className="space-y-2">
          {filtered.map((problem, i) => (
            <motion.div key={problem.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{problem.title}</span>
                      <Badge color={diffColor[problem.difficulty]}>{problem.difficulty}</Badge>
                      <Badge color="blue">{problem.topic}</Badge>
                      <span className="text-xs text-gray-400">{problem.platform}</span>
                      {problem.needsRevision && <Badge color="amber">🔁 Revise</Badge>}
                    </div>
                    {problem.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{problem.notes}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(problem.solvedAt)}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {problem.link && (
                      <a href={problem.link} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button onClick={() => { toggleRevision(problem.id); toast.success(problem.needsRevision ? 'Removed from revision' : 'Marked for revision') }}
                      className={`p-2 rounded-lg transition-colors ${problem.needsRevision ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}>
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { deleteProblem(problem.id); toast.success('Problem removed') }}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Log DSA Problem">
        <div className="space-y-4">
          <Input label="Problem Title *" placeholder="e.g. Two Sum" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Platform" value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}>
              {DSA_PLATFORMS.map(pl => <option key={pl}>{pl}</option>)}
            </Select>
            <Select label="Difficulty" value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </Select>
          </div>
          <Select label="Topic" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}>
            {DSA_TOPICS.map(t => <option key={t}>{t}</option>)}
          </Select>
          <Input label="Problem Link (optional)" placeholder="https://leetcode.com/..." value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Notes</label>
            <textarea rows={3} placeholder="Key insights, approach, time complexity..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary-500/30 resize-none transition-all" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleAdd} className="flex-1">Log Problem 💪</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
