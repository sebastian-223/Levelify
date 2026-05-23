import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Bookmark, ExternalLink, Trash2, CheckCircle2, Star } from 'lucide-react'
import { useResourcesStore } from '@/store/resourcesStore'
import { useDebounce } from '@/hooks/index'
import { Button, Modal, EmptyState, Badge } from '@/components/ui/index'
import { RESOURCE_CATEGORIES } from '@/constants/categories'
import { formatRelativeTime, cn } from '@/utils/index'
import { toast } from 'sonner'

const PRIORITY_COLORS = { high: 'red', medium: 'amber', low: 'green' }
const EMPTY_FORM = { title: '', url: '', category: 'dsa', description: '', priority: 'medium' }

function ResourceCard({ resource, onBookmark, onVisit, onDelete }) {
  const cat = RESOURCE_CATEGORIES.find(c => c.id === resource.category)

  const handleOpen = () => {
    onVisit(resource.id)
    window.open(resource.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'group rounded-2xl border p-4 flex flex-col gap-3 transition-all hover:shadow-md dark:hover:shadow-black/30 hover:border-primary-300 dark:hover:border-primary-700',
        resource.isVisited ? 'bg-gray-50 dark:bg-white/3' : 'bg-white dark:bg-surface-card-dark',
        'border-gray-200 dark:border-gray-800'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl flex-shrink-0">{cat?.icon || '🔗'}</span>
          <div className="min-w-0">
            <h3 className={cn('font-bold text-sm leading-tight', resource.isVisited ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white')}>{resource.title}</h3>
            <p className="text-xs text-gray-400 truncate mt-0.5">{resource.url}</p>
          </div>
        </div>
        {resource.isVisited && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />}
      </div>

      {resource.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{resource.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Badge color="gray" className="text-[10px]">{cat?.label}</Badge>
          <Badge color={PRIORITY_COLORS[resource.priority]} className="text-[10px]">{resource.priority}</Badge>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onBookmark(resource.id)} className={cn('p-1.5 rounded-lg transition-colors', resource.isBookmarked ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500')}>
            <Bookmark className={cn('w-3.5 h-3.5', resource.isBookmarked && 'fill-current')} />
          </button>
          <button onClick={handleOpen} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(resource.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className="text-[10px] text-gray-400">{formatRelativeTime(resource.addedAt)}</p>
    </motion.div>
  )
}

export default function ResourcesPage() {
  const { addResource, deleteResource, toggleBookmark, markVisited, getFilteredResources } = useResourcesStore()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showBookmarked, setShowBookmarked] = useState(false)
  const debouncedSearch = useDebounce(search)

  const resources = useMemo(() => getFilteredResources(activeCategory === 'all' ? null : activeCategory, debouncedSearch, showBookmarked),
    [getFilteredResources, activeCategory, debouncedSearch, showBookmarked])

  const handleAdd = () => {
    if (!form.title.trim() || !form.url.trim()) { toast.error('Title and URL are required'); return }
    let url = form.url.trim()
    if (!url.startsWith('http')) url = 'https://' + url
    addResource({ ...form, url })
    setForm(EMPTY_FORM)
    setShowModal(false)
    toast.success('Resource saved! 🔗')
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Resource Manager 🔗</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{resources.length} resources • Your learning library</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBookmarked(p => !p)} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all border', showBookmarked ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')}>
            <Bookmark className={cn('w-4 h-4 inline mr-1.5', showBookmarked && 'fill-current')} />Bookmarked
          </button>
          <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Resource</Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 transition-all text-gray-900 dark:text-gray-100" />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {RESOURCE_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex-shrink-0',
              activeCategory === cat.id
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-300')}>
            <span>{cat.icon}</span>{cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {resources.length === 0 ? (
        <EmptyState icon="🔗" title="No resources found" description="Save YouTube playlists, articles, docs, and useful links." action={<Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add First Resource</Button>} />
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {resources.map(r => (
              <ResourceCard key={r.id} resource={r}
                onBookmark={toggleBookmark}
                onVisit={markVisited}
                onDelete={(id) => { deleteResource(id); toast.success('Resource removed') }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Learning Resource">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Title *</label>
            <input placeholder="e.g. Striver A2Z DSA Sheet" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">URL *</label>
            <input placeholder="https://..." value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/30">
                {RESOURCE_CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/30">
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Description</label>
            <textarea rows={2} placeholder="Brief description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500/30 resize-none transition-all" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleAdd} className="flex-1">Save Resource 🔗</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
