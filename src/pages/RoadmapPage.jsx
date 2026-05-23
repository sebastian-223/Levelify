import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink, Map } from 'lucide-react'
import { useRoadmapStore } from '@/store/otherStores'
import { Card, ProgressBar } from '@/components/ui/index'
import { cn } from '@/utils/index'

const ROADMAPS = {
  frontend: {
    label: 'Frontend',
    emoji: '🎨',
    color: 'purple',
    phases: [
      {
        title: 'Phase 1 — Foundations',
        nodes: [
          { id: 'html', title: 'HTML Fundamentals', desc: 'Semantic HTML, forms, accessibility, meta tags', hours: 8, resources: [{ label: 'MDN HTML', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' }] },
          { id: 'css', title: 'CSS & Flexbox/Grid', desc: 'Box model, Flexbox, Grid, animations, responsive design', hours: 16, resources: [{ label: 'CSS Tricks', url: 'https://css-tricks.com' }] },
          { id: 'js-basics', title: 'JavaScript Basics', desc: 'Variables, data types, functions, DOM manipulation', hours: 24, resources: [{ label: 'javascript.info', url: 'https://javascript.info' }] },
        ],
      },
      {
        title: 'Phase 2 — Intermediate',
        nodes: [
          { id: 'js-advanced', title: 'Advanced JavaScript', desc: 'Closures, promises, async/await, ES6+, event loop', hours: 20, resources: [{ label: 'You Dont Know JS', url: 'https://github.com/getify/You-Dont-Know-JS' }] },
          { id: 'typescript', title: 'TypeScript', desc: 'Types, interfaces, generics, decorators', hours: 16, resources: [{ label: 'TS Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' }] },
          { id: 'react', title: 'React.js', desc: 'Components, hooks, state, context, React Router', hours: 32, resources: [{ label: 'React Docs', url: 'https://react.dev' }] },
        ],
      },
      {
        title: 'Phase 3 — Advanced',
        nodes: [
          { id: 'nextjs', title: 'Next.js', desc: 'SSR, SSG, ISR, App Router, API routes', hours: 20, resources: [{ label: 'Next.js Docs', url: 'https://nextjs.org/docs' }] },
          { id: 'testing', title: 'Testing', desc: 'Jest, React Testing Library, Cypress', hours: 12, resources: [{ label: 'Testing Library', url: 'https://testing-library.com' }] },
          { id: 'performance', title: 'Web Performance', desc: 'Lazy loading, code splitting, Core Web Vitals, Lighthouse', hours: 10, resources: [{ label: 'web.dev', url: 'https://web.dev/performance' }] },
        ],
      },
    ],
  },
  backend: {
    label: 'Backend',
    emoji: '⚙️',
    color: 'green',
    phases: [
      {
        title: 'Phase 1 — Foundations',
        nodes: [
          { id: 'nodejs', title: 'Node.js Basics', desc: 'Event loop, modules, file system, streams', hours: 16, resources: [{ label: 'Node.js Docs', url: 'https://nodejs.org/docs' }] },
          { id: 'express', title: 'Express.js', desc: 'Routing, middleware, error handling, REST APIs', hours: 14, resources: [{ label: 'Express Docs', url: 'https://expressjs.com' }] },
          { id: 'databases', title: 'Databases', desc: 'SQL (PostgreSQL/MySQL) + NoSQL (MongoDB) fundamentals', hours: 20, resources: [{ label: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com' }] },
        ],
      },
      {
        title: 'Phase 2 — Core Backend',
        nodes: [
          { id: 'auth', title: 'Authentication & Security', desc: 'JWT, OAuth2, bcrypt, CORS, rate limiting', hours: 14, resources: [{ label: 'Auth0 Blog', url: 'https://auth0.com/blog' }] },
          { id: 'redis', title: 'Caching with Redis', desc: 'Caching strategies, pub/sub, session storage', hours: 10, resources: [{ label: 'Redis Docs', url: 'https://redis.io/documentation' }] },
          { id: 'docker', title: 'Docker & Containers', desc: 'Dockerfiles, docker-compose, container networking', hours: 12, resources: [{ label: 'Docker Docs', url: 'https://docs.docker.com' }] },
        ],
      },
      {
        title: 'Phase 3 — Advanced',
        nodes: [
          { id: 'microservices', title: 'Microservices Architecture', desc: 'Service decomposition, API gateway, message queues', hours: 16, resources: [] },
          { id: 'ci-cd', title: 'CI/CD Pipelines', desc: 'GitHub Actions, deployment automation, monitoring', hours: 8, resources: [] },
        ],
      },
    ],
  },
  dsa: {
    label: 'DSA',
    emoji: '🔢',
    color: 'blue',
    phases: [
      {
        title: 'Phase 1 — Basics',
        nodes: [
          { id: 'arrays', title: 'Arrays & Strings', desc: 'Two pointer, sliding window, prefix sum patterns', hours: 20, resources: [{ label: 'NeetCode', url: 'https://neetcode.io' }] },
          { id: 'hashing', title: 'Hashing & Maps', desc: 'HashMaps, HashSets, frequency counting', hours: 10, resources: [] },
          { id: 'linkedlist', title: 'Linked Lists', desc: 'Fast/slow pointer, reversal, cycle detection', hours: 12, resources: [] },
        ],
      },
      {
        title: 'Phase 2 — Intermediate DS',
        nodes: [
          { id: 'stacks-queues', title: 'Stacks & Queues', desc: 'Monotonic stack, deque, LRU cache', hours: 10, resources: [] },
          { id: 'trees', title: 'Binary Trees & BST', desc: 'BFS, DFS, LCA, Morris traversal', hours: 18, resources: [{ label: "Striver's Tree Series", url: 'https://takeuforward.org' }] },
          { id: 'heaps', title: 'Heaps & Priority Queue', desc: 'Min/Max heap, K-way merge, top-K problems', hours: 10, resources: [] },
        ],
      },
      {
        title: 'Phase 3 — Advanced Algorithms',
        nodes: [
          { id: 'graphs', title: 'Graph Algorithms', desc: 'BFS/DFS, Dijkstra, topological sort, union-find', hours: 20, resources: [] },
          { id: 'dp', title: 'Dynamic Programming', desc: '1D/2D DP, knapsack, LCS, interval DP', hours: 30, resources: [{ label: 'DP Patterns', url: 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns' }] },
          { id: 'backtracking', title: 'Backtracking', desc: 'Permutations, subsets, N-Queens, Sudoku', hours: 12, resources: [] },
        ],
      },
    ],
  },
  systemdesign: {
    label: 'System Design',
    emoji: '🏗️',
    color: 'orange',
    phases: [
      {
        title: 'Phase 1 — Fundamentals',
        nodes: [
          { id: 'scalability', title: 'Scalability Basics', desc: 'Horizontal vs vertical scaling, load balancing', hours: 8, resources: [{ label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' }] },
          { id: 'databases-sd', title: 'Database Design', desc: 'SQL vs NoSQL, indexing, sharding, replication', hours: 10, resources: [] },
          { id: 'caching-sd', title: 'Caching Strategies', desc: 'Cache-aside, write-through, CDN, Redis', hours: 8, resources: [] },
        ],
      },
      {
        title: 'Phase 2 — Core Concepts',
        nodes: [
          { id: 'api-design', title: 'API Design', desc: 'REST vs GraphQL, pagination, versioning, rate limiting', hours: 8, resources: [] },
          { id: 'message-queues', title: 'Message Queues', desc: 'Kafka, RabbitMQ, pub-sub pattern, event sourcing', hours: 10, resources: [] },
          { id: 'microservices-sd', title: 'Microservices Design', desc: 'Service mesh, circuit breaker, saga pattern', hours: 12, resources: [] },
        ],
      },
    ],
  },
  interview: {
    label: 'Interview Prep',
    emoji: '💼',
    color: 'red',
    phases: [
      {
        title: 'Phase 1 — Technical',
        nodes: [
          { id: 'dsa-prep', title: 'DSA Problem Solving', desc: 'LeetCode Top 150, pattern-based practice', hours: 80, resources: [{ label: 'LeetCode', url: 'https://leetcode.com' }] },
          { id: 'cs-fundamentals', title: 'CS Fundamentals', desc: 'OS, DBMS, CN, OOPs — classic interview topics', hours: 24, resources: [] },
          { id: 'project-building', title: 'Strong Projects', desc: '2 full-stack projects with live demo + GitHub', hours: 60, resources: [] },
        ],
      },
      {
        title: 'Phase 2 — Soft Skills',
        nodes: [
          { id: 'resume', title: 'Resume & LinkedIn', desc: 'ATS-friendly resume, LinkedIn optimization, GitHub profile', hours: 8, resources: [] },
          { id: 'mock-interviews', title: 'Mock Interviews', desc: 'Pramp, Interviewing.io, peers — weekly practice', hours: 20, resources: [{ label: 'Pramp', url: 'https://www.pramp.com' }] },
          { id: 'behavioral', title: 'Behavioral Questions', desc: 'STAR method, leadership, teamwork, conflict stories', hours: 6, resources: [] },
        ],
      },
    ],
  },
}

function RoadmapNode({ node, roadmapId, isCompleted, onToggle }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <motion.div layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
      className={cn('border rounded-xl transition-all duration-200', isCompleted ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-white dark:bg-surface-card-dark border-gray-200 dark:border-gray-800')}>
      <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <button onClick={e => { e.stopPropagation(); onToggle() }}
          className={cn('flex-shrink-0 transition-colors', isCompleted ? 'text-green-500' : 'text-gray-300 dark:text-gray-600 hover:text-primary-400')}>
          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={cn('font-semibold text-sm', isCompleted ? 'text-green-700 dark:text-green-400 line-through opacity-75' : 'text-gray-900 dark:text-white')}>
            {node.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{node.desc}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400">{node.hours}h</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 dark:border-gray-800">
            <div className="px-4 py-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{node.desc}</p>
              {node.resources?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {node.resources.map(r => (
                    <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 transition-colors">
                      <ExternalLink className="w-3 h-3" />{r.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function RoadmapPage() {
  const { activeRoadmap, setActiveRoadmap, toggleNode, isCompleted, getProgress } = useRoadmapStore()
  const roadmap = ROADMAPS[activeRoadmap]
  const allNodes = useMemo(() => roadmap.phases.flatMap(p => p.nodes), [roadmap])
  const progress = getProgress(activeRoadmap, allNodes.length)

  const colorMap = { purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20', green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20', blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20', orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20', red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' }

  return (
    <div className="page-wrapper">
      {/* Roadmap selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        {Object.entries(ROADMAPS).map(([key, r]) => (
          <button key={key} onClick={() => setActiveRoadmap(key)}
            className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border',
              activeRoadmap === key
                ? 'bg-primary-600 text-white border-primary-600 shadow-glow-primary'
                : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-400')}>
            <span>{r.emoji}</span>{r.label}
          </button>
        ))}
      </div>

      {/* Progress header */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{roadmap.emoji}</span>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">{roadmap.label} Roadmap</h2>
              <p className="text-xs text-gray-400">{allNodes.filter(n => isCompleted(activeRoadmap, n.id)).length} / {allNodes.length} topics completed</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress}%</p>
            <p className="text-xs text-gray-400">Progress</p>
          </div>
        </div>
        <ProgressBar value={progress} max={100} color={progress === 100 ? 'green' : 'primary'} size="md" />
      </Card>

      {/* Phases */}
      <div className="space-y-6">
        {roadmap.phases.map((phase, pi) => {
          const phaseCompleted = phase.nodes.filter(n => isCompleted(activeRoadmap, n.id)).length
          return (
            <motion.div key={pi} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pi * 0.1 }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{phase.title}</h3>
                <span className="text-xs text-gray-400">{phaseCompleted}/{phase.nodes.length}</span>
              </div>
              <div className="space-y-2">
                {phase.nodes.map((node, ni) => (
                  <motion.div key={node.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: pi * 0.1 + ni * 0.05 }}>
                    <RoadmapNode
                      node={node}
                      roadmapId={activeRoadmap}
                      isCompleted={isCompleted(activeRoadmap, node.id)}
                      onToggle={() => toggleNode(activeRoadmap, node.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
