import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useResourcesStore = create(
  persist(
    (set, get) => ({
      resources: [],

      addResource: (resource) =>
        set(s => ({
          resources: [{
            ...resource,
            id: Date.now(),
            addedAt: new Date().toISOString(),
            isVisited: false,
            isBookmarked: false,
            priority: resource.priority || 'medium',
          }, ...s.resources],
        })),

      updateResource: (id, data) =>
        set(s => ({ resources: s.resources.map(r => r.id === id ? { ...r, ...data } : r) })),

      deleteResource: (id) =>
        set(s => ({ resources: s.resources.filter(r => r.id !== id) })),

      toggleBookmark: (id) =>
        set(s => ({ resources: s.resources.map(r => r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r) })),

      markVisited: (id) =>
        set(s => ({ resources: s.resources.map(r => r.id === id ? { ...r, isVisited: true } : r) })),

      getFilteredResources: (category, query, showBookmarked) => {
        let { resources } = get()
        if (category && category !== 'all') resources = resources.filter(r => r.category === category)
        if (query) {
          const q = query.toLowerCase()
          resources = resources.filter(r =>
            r.title?.toLowerCase().includes(q) ||
            r.url?.toLowerCase().includes(q) ||
            r.description?.toLowerCase().includes(q)
          )
        }
        if (showBookmarked) resources = resources.filter(r => r.isBookmarked)
        return resources
      },
    }),
    { name: 'levelify-resources' }
  )
)
