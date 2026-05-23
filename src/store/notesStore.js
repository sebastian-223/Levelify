import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useNotesStore = create(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (note) =>
        set(s => ({
          notes: [{
            ...note,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPinned: false,
            isFavorite: false,
            tags: note.tags || [],
            color: note.color || 'default',
            category: note.category || 'custom',
          }, ...s.notes],
        })),

      updateNote: (id, data) =>
        set(s => ({
          notes: s.notes.map(n => n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n),
        })),

      deleteNote: (id) => set(s => ({ notes: s.notes.filter(n => n.id !== id) })),
      togglePin: (id) => set(s => ({ notes: s.notes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n) })),
      toggleFavorite: (id) => set(s => ({ notes: s.notes.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n) })),

      getFilteredNotes: (category, query, tag) => {
        let { notes } = get()
        if (category && category !== 'all') notes = notes.filter(n => n.category === category)
        if (query) {
          const q = query.toLowerCase()
          notes = notes.filter(n =>
            n.title?.toLowerCase().includes(q) ||
            n.content?.toLowerCase().includes(q) ||
            n.tags?.some(t => t.toLowerCase().includes(q))
          )
        }
        if (tag) notes = notes.filter(n => n.tags?.includes(tag))
        const pinned = notes.filter(n => n.isPinned)
        const rest = notes.filter(n => !n.isPinned)
        return [...pinned, ...rest]
      },
    }),
    { name: 'levelify-notes' }
  )
)
