import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDSAStore = create(
  persist(
    (set, get) => ({
      problems: [],
      addProblem: (problem) =>
        set(s => ({
          problems: [{ ...problem, id: Date.now(), solvedAt: new Date().toISOString(), needsRevision: false }, ...s.problems],
        })),
      updateProblem: (id, data) =>
        set(s => ({ problems: s.problems.map(p => p.id === id ? { ...p, ...data } : p) })),
      deleteProblem: (id) =>
        set(s => ({ problems: s.problems.filter(p => p.id !== id) })),
      toggleRevision: (id) =>
        set(s => ({ problems: s.problems.map(p => p.id === id ? { ...p, needsRevision: !p.needsRevision } : p) })),
      getStats: () => {
        const { problems } = get()
        return {
          total: problems.length,
          easy: problems.filter(p => p.difficulty === 'easy').length,
          medium: problems.filter(p => p.difficulty === 'medium').length,
          hard: problems.filter(p => p.difficulty === 'hard').length,
          needsRevision: problems.filter(p => p.needsRevision).length,
        }
      },
    }),
    { name: 'levelify-dsa' }
  )
)
