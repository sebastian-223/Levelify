import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Pin, Heart, Trash2, Tag, Edit3, X } from 'lucide-react'
import { useNotesStore } from '@/store/notesStore'
import { useDebounce } from '@/hooks/index'
import { Button, Modal, EmptyState, Badge } from '@/components/ui/index'
import { NOTE_CATEGORIES, NOTE_COLORS } from '@/constants/categories'
import { formatRelativeTime } from '@/utils/index'
import { toast } from 'sonner'
import { cn } from '@/utils/index'

const EMPTY_FORM = { title: '', content: '', category: 'dsa', color: 'default', tags: '' }

function NoteCard({ note, onEdit, onDelete, onPin, onFavorite }) {
  const colorObj = NOTE_COLORS.find(c => c.id === (note.color || 'default')) || NOTE_COLORS[0]
  const catObj = NOTE_CATEGORIES.find(c => c.id === note.category)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      className={cn('relative rounded-2xl border p-4 flex flex-col gap-3 group cursor-pointer transition-shadow hover:shadow-md dark:hover:shadow-black/30', colorObj.bg, colorObj.border)}
    >
      {/* Pin badge */}
      {note.isPinned && (
        <div className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full p-1">
          <Pin className="w-3 h-3" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-base">{catObj?.icon}</span>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">{note.title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onPin(note.id)} className={cn('p-1.5 rounded-lg transition-colors', note.isPinned ? 'text-primary-500' : 'text-gray-400 hover:text-primary-500')}>
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onFavorite(note.id)} className={cn('p-1.5 rounded-lg transition-colors', note.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500')}>
            <Heart className={cn('w-3.5 h-3.5', note.isFavorite && 'fill-current')} />
          </button>
          <button onClick={() => onEdit(note)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 transition-colors">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(note.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {note.content && (
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4 whitespace-pre-wrap">{note.content}</p>
      )}

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {note.tags.slice(0, 4).map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-400">
              <Tag className="w-2.5 h-2.5" />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
        <Badge color="gray" className="text-[10px]">{catObj?.label}</Badge>
        <span className="text-[11px] text-gray-400">{formatRelativeTime(note.updatedAt)}</span>
      </div>
    </motion.div>
  )
}

function NoteForm({ form, setForm, onSave, onCancel, editId }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Title *</label>
        <input placeholder="Note title..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Content</label>
        <textarea rows={5} placeholder="Write your note here..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary-500/30 resize-none transition-all" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Category</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/30">
            {NOTE_CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Card Color</label>
          <div className="flex gap-2 flex-wrap pt-1">
            {NOTE_COLORS.map(c => (
              <button key={c.id} onClick={() => setForm(p => ({ ...p, color: c.id }))}
                className={cn('w-7 h-7 rounded-lg border-2 transition-all', c.bg, form.color === c.id ? 'border-primary-500 scale-110' : 'border-transparent hover:scale-105')} />
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Tags (comma separated)</label>
        <input placeholder="e.g. template, important, dp" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" />
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={onSave} className="flex-1">{editId ? 'Update Note' : 'Save Note 📝'}</Button>
      </div>
    </div>
  )
}

export default function NotesPage() {
  const { addNote, updateNote, deleteNote, togglePin, toggleFavorite, getFilteredNotes } = useNotesStore()
  const [showModal, setShowModal] = useState(false)
  const [editNote, setEditNote] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showFavs, setShowFavs] = useState(false)
  const debouncedSearch = useDebounce(search)

  const notes = useMemo(() => {
    let filtered = getFilteredNotes(activeCategory === 'all' ? null : activeCategory, debouncedSearch)
    if (showFavs) filtered = filtered.filter(n => n.isFavorite)
    return filtered
  }, [getFilteredNotes, activeCategory, debouncedSearch, showFavs])

  const openAdd = () => { setEditNote(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (note) => {
    setEditNote(note)
    setForm({ title: note.title, content: note.content, category: note.category, color: note.color, tags: (note.tags || []).join(', ') })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    if (editNote) {
      updateNote(editNote.id, { ...form, tags })
      toast.success('Note updated!')
    } else {
      addNote({ ...form, tags })
      toast.success('Note saved! 📝')
    }
    setShowModal(false)
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Smart Notes 📝</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notes.length} notes • Capture, organize, revise</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFavs(p => !p)} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all border', showFavs ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300')}>
            <Heart className={cn('w-4 h-4 inline mr-1.5', showFavs && 'fill-current')} />Favorites
          </button>
          <Button onClick={openAdd}><Plus className="w-4 h-4" /> New Note</Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input placeholder="Search notes, tags..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {NOTE_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex-shrink-0',
              activeCategory === cat.id
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-300')}>
            <span>{cat.icon}</span>{cat.label}
          </button>
        ))}
      </div>

      {/* Notes grid */}
      {notes.length === 0 ? (
        <EmptyState icon="📝" title="No notes here" description="Capture your learning insights, code snippets, and key concepts." action={<Button onClick={openAdd}><Plus className="w-4 h-4" /> Write First Note</Button>} />
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {notes.map(note => (
              <NoteCard key={note.id} note={note}
                onEdit={openEdit}
                onDelete={(id) => { deleteNote(id); toast.success('Note deleted') }}
                onPin={togglePin}
                onFavorite={toggleFavorite}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editNote ? 'Edit Note' : 'New Note'} size="md">
        <NoteForm form={form} setForm={setForm} onSave={handleSave} onCancel={() => setShowModal(false)} editId={editNote?.id} />
      </Modal>
    </div>
  )
}
