import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Roadmap Store 
export const useRoadmapStore = create(
  persist(
    (set, get) => ({
      completedNodes: {},   
      nodeNotes: {},        
      activeRoadmap: 'frontend',

      setActiveRoadmap: (id) => set({ activeRoadmap: id }),

      toggleNode: (roadmapId, nodeId) =>
        set(s => {
          const key = roadmapId
          const current = new Set(s.completedNodes[key] || [])
          if (current.has(nodeId)) current.delete(nodeId)
          else current.add(nodeId)
          return { completedNodes: { ...s.completedNodes, [key]: [...current] } }
        }),

      isCompleted: (roadmapId, nodeId) => {
        const arr = get().completedNodes[roadmapId] || []
        return arr.includes(nodeId)
      },

      getProgress: (roadmapId, total) => {
        const arr = get().completedNodes[roadmapId] || []
        return total > 0 ? Math.round((arr.length / total) * 100) : 0
      },

      setNodeNote: (roadmapId, nodeId, note) =>
        set(s => ({ nodeNotes: { ...s.nodeNotes, [`${roadmapId}-${nodeId}`]: note } })),
    }),
    {
      name: 'levelify-roadmap',
      partialize: s => ({ completedNodes: s.completedNodes, nodeNotes: s.nodeNotes, activeRoadmap: s.activeRoadmap }),
    }
  )
)

// Streak Store
export const useStreakStore = create(
  persist(
    (set, get) => ({
      activityLog: {}, 
      logActivity: (date) => {
        const key = date || new Date().toISOString().split('T')[0]
        set(s => ({ activityLog: { ...s.activityLog, [key]: (s.activityLog[key] || 0) + 1 } }))
      },

      getCurrentStreak: () => {
        const { activityLog } = get()
        let streak = 0
        const today = new Date()
        for (let i = 0; i < 365; i++) {
          const d = new Date(today)
          d.setDate(today.getDate() - i)
          const key = d.toISOString().split('T')[0]
          if (activityLog[key]) streak++
          else if (i > 0) break
        }
        return streak
      },

      getLongestStreak: () => {
        const { activityLog } = get()
        const dates = Object.keys(activityLog).sort()
        let longest = 0, current = 0
        for (let i = 0; i < dates.length; i++) {
          if (i === 0) { current = 1; continue }
          const prev = new Date(dates[i - 1])
          const curr = new Date(dates[i])
          const diff = (curr - prev) / (1000 * 60 * 60 * 24)
          if (diff === 1) current++
          else current = 1
          longest = Math.max(longest, current)
        }
        return Math.max(longest, current)
      },
    }),
    { name: 'levelify-streak' }
  )
)

// Cert Store 
export const useCertStore = create(
  persist(
    (set) => ({
      certs: [],
      addCert: (cert) =>
        set(s => ({
          certs: [{ ...cert, id: Date.now(), createdAt: new Date().toISOString(), progress: cert.progress || 0 }, ...s.certs],
        })),
      updateCert: (id, data) =>
        set(s => ({ certs: s.certs.map(c => c.id === id ? { ...c, ...data } : c) })),
      deleteCert: (id) =>
        set(s => ({ certs: s.certs.filter(c => c.id !== id) })),
    }),
    { name: 'levelify-certs' }
  )
)

// Timer Store 
export const useTimerStore = create(
  persist(
    (set) => ({
      sessions: [],
      totalFocusSeconds: 0,
      addSession: (session) =>
        set(s => ({
          sessions: [{ ...session, id: Date.now(), completedAt: new Date().toISOString() }, ...s.sessions],
          totalFocusSeconds: s.totalFocusSeconds + (session.durationSeconds || 0),
        })),
    }),
    { name: 'levelify-timer', partialize: s => ({ sessions: s.sessions.slice(0, 100), totalFocusSeconds: s.totalFocusSeconds }) }
  )
)
