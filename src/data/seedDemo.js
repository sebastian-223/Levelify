// src/data/seedDemo.js
// Run this once on app init to populate demo account + sample data
// Called from main.jsx if no demo user exists

const DEMO_EMAIL = 'demo@levelify.app'
const DEMO_PASSWORD = 'demo123'
const MOCK_USERS_KEY = 'levelify-mock-users'

export function seedDemoData() {
  // Create demo user if not exists
  const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]')
  if (!users.find(u => u.email === DEMO_EMAIL)) {
    const demoUser = {
      id: 9999,
      name: 'Demo User',
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([...users, demoUser]))
  }

  // Seed DSA problems
  const dsaKey = 'levelify-dsa'
  if (!localStorage.getItem(dsaKey)) {
    const now = Date.now()
    const problems = [
      { id: now - 10000, title: 'Two Sum', platform: 'LeetCode', difficulty: 'easy', topic: 'Arrays', link: 'https://leetcode.com/problems/two-sum/', solvedAt: new Date(Date.now() - 5 * 86400000).toISOString(), needsRevision: false, notes: 'Use hashmap for O(n) solution. Classic problem.' },
      { id: now - 9000, title: 'Valid Parentheses', platform: 'LeetCode', difficulty: 'easy', topic: 'Stack', link: 'https://leetcode.com/problems/valid-parentheses/', solvedAt: new Date(Date.now() - 4 * 86400000).toISOString(), needsRevision: false, notes: 'Use stack, push open brackets, pop and match on close.' },
      { id: now - 8000, title: 'Binary Search', platform: 'LeetCode', difficulty: 'easy', topic: 'Binary Search', link: 'https://leetcode.com/problems/binary-search/', solvedAt: new Date(Date.now() - 3 * 86400000).toISOString(), needsRevision: false, notes: 'Template: left=0, right=n-1, mid=left+(right-left)/2' },
      { id: now - 7000, title: 'Longest Substring Without Repeating', platform: 'LeetCode', difficulty: 'medium', topic: 'Sliding Window', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', solvedAt: new Date(Date.now() - 2 * 86400000).toISOString(), needsRevision: true, notes: 'Sliding window + hashset. Track window start pointer.' },
      { id: now - 6000, title: 'Maximum Subarray', platform: 'LeetCode', difficulty: 'medium', topic: 'Dynamic Programming', link: 'https://leetcode.com/problems/maximum-subarray/', solvedAt: new Date(Date.now() - 2 * 86400000).toISOString(), needsRevision: false, notes: "Kadane's algorithm. O(n) time, O(1) space." },
      { id: now - 5000, title: 'Merge Intervals', platform: 'LeetCode', difficulty: 'medium', topic: 'Arrays', link: 'https://leetcode.com/problems/merge-intervals/', solvedAt: new Date(Date.now() - 1 * 86400000).toISOString(), needsRevision: false, notes: 'Sort by start time, then merge overlapping intervals.' },
      { id: now - 4000, title: 'Course Schedule', platform: 'LeetCode', difficulty: 'medium', topic: 'Graphs', link: 'https://leetcode.com/problems/course-schedule/', solvedAt: new Date(Date.now() - 1 * 86400000).toISOString(), needsRevision: true, notes: 'Topological sort / cycle detection in directed graph. BFS with indegree array.' },
      { id: now - 3000, title: 'Word Break', platform: 'LeetCode', difficulty: 'medium', topic: 'Dynamic Programming', link: 'https://leetcode.com/problems/word-break/', solvedAt: new Date().toISOString(), needsRevision: false, notes: 'DP: dp[i] = true if s[0..i] can be segmented. Check all substrings.' },
      { id: now - 2000, title: 'Trapping Rain Water', platform: 'LeetCode', difficulty: 'hard', topic: 'Two Pointers', link: 'https://leetcode.com/problems/trapping-rain-water/', solvedAt: new Date().toISOString(), needsRevision: false, notes: 'Two pointer approach. Track maxLeft and maxRight.' },
    ]
    localStorage.setItem(dsaKey, JSON.stringify({ state: { problems }, version: 0 }))
  }

  // Seed notes
  const notesKey = 'levelify-notes'
  if (!localStorage.getItem(notesKey)) {
    const now = Date.now()
    const notes = [
      { id: now - 5000, title: 'Binary Search Template', content: 'Always use left + (right - left) / 2 to avoid integer overflow.\n\nTemplate:\nleft = 0, right = n - 1\nwhile left <= right:\n  mid = left + (right - left) // 2\n  if arr[mid] == target: return mid\n  elif arr[mid] < target: left = mid + 1\n  else: right = mid - 1', category: 'dsa', color: 'blue', tags: ['template', 'binary-search', 'important'], isPinned: true, isFavorite: true, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: now - 4000, title: 'React Hooks Cheatsheet', content: 'useState - local state\nuseEffect - side effects\nuseCallback - memoize functions\nuseMemo - memoize values\nuseRef - DOM refs / mutable values\nuseContext - consume context\nuseReducer - complex state logic', category: 'frontend', color: 'purple', tags: ['react', 'hooks', 'cheatsheet'], isPinned: false, isFavorite: true, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: now - 3000, title: 'System Design Checklist', content: '1. Clarify requirements (functional + non-functional)\n2. Estimate scale (QPS, storage, bandwidth)\n3. High-level design\n4. Data model & DB choice\n5. Core component deep-dive\n6. Bottlenecks & trade-offs\n7. Monitoring & failure handling', category: 'system-design', color: 'amber', tags: ['system-design', 'interview', 'checklist'], isPinned: true, isFavorite: false, createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
      { id: now - 2000, title: 'Kadane\'s Algorithm', content: "Max subarray sum in O(n):\n\ncurrent_max = arr[0]\nglobal_max = arr[0]\nfor i in range(1, n):\n  current_max = max(arr[i], current_max + arr[i])\n  global_max = max(global_max, current_max)", category: 'dsa', color: 'green', tags: ['dp', 'kadane', 'array'], isPinned: false, isFavorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]
    localStorage.setItem(notesKey, JSON.stringify({ state: { notes }, version: 0 }))
  }

  // Seed resources
  const resourcesKey = 'levelify-resources'
  if (!localStorage.getItem(resourcesKey)) {
    const now = Date.now()
    const resources = [
      { id: now - 6000, title: 'Striver A2Z DSA Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', category: 'dsa', description: 'Complete DSA roadmap by Striver — 455 problems organized by topic', priority: 'high', isVisited: true, isBookmarked: true, addedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
      { id: now - 5000, title: 'NeetCode 150', url: 'https://neetcode.io/practice', category: 'dsa', description: 'Curated 150 LeetCode problems with video solutions', priority: 'high', isVisited: false, isBookmarked: true, addedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
      { id: now - 4000, title: 'React Official Docs', url: 'https://react.dev', category: 'frontend', description: 'Official React documentation with interactive examples', priority: 'high', isVisited: true, isBookmarked: true, addedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
      { id: now - 3000, title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', category: 'system-design', description: 'Learn how to design large scale systems — 240k GitHub stars', priority: 'high', isVisited: false, isBookmarked: false, addedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: now - 2000, title: 'javascript.info', url: 'https://javascript.info', category: 'frontend', description: 'The Modern JavaScript Tutorial — from basics to advanced topics', priority: 'medium', isVisited: true, isBookmarked: false, addedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: now - 1000, title: 'Grokking System Design', url: 'https://www.designgurus.io/course/grokking-the-system-design-interview', category: 'system-design', description: 'Most popular system design interview preparation course', priority: 'medium', isVisited: false, isBookmarked: true, addedAt: new Date().toISOString() },
    ]
    localStorage.setItem(resourcesKey, JSON.stringify({ state: { resources }, version: 0 }))
  }

  // Seed streak activity (last 30 days)
  const streakKey = 'levelify-streak'
  if (!localStorage.getItem(streakKey)) {
    const activityLog = {}
    const today = new Date()
    // Simulate 20 active days in last 30
    const activeDays = [0, 1, 2, 3, 5, 6, 7, 8, 10, 12, 13, 14, 15, 16, 18, 20, 21, 22, 25, 28]
    activeDays.forEach(daysAgo => {
      const d = new Date(today)
      d.setDate(today.getDate() - daysAgo)
      const key = d.toISOString().split('T')[0]
      activityLog[key] = Math.floor(Math.random() * 5) + 1
    })
    localStorage.setItem(streakKey, JSON.stringify({ state: { activityLog }, version: 0 }))
  }

  // Seed certifications
  const certKey = 'levelify-certs'
  if (!localStorage.getItem(certKey)) {
    const certs = [
      { id: Date.now() - 3000, name: 'Meta Frontend Developer Certificate', provider: 'Coursera / Meta', progress: 65, link: '', deadline: '2024-06-30', notes: 'In progress', createdAt: new Date().toISOString() },
      { id: Date.now() - 2000, name: 'AWS Cloud Practitioner', provider: 'Amazon Web Services', progress: 30, link: '', deadline: '2024-08-15', notes: 'Studying cloud fundamentals', createdAt: new Date().toISOString() },
      { id: Date.now() - 1000, name: 'Google Data Analytics', provider: 'Google / Coursera', progress: 100, link: 'https://coursera.org/verify/professional-cert/xxx', deadline: '', notes: 'Completed!', createdAt: new Date().toISOString() },
    ]
    localStorage.setItem(certKey, JSON.stringify({ state: { certs }, version: 0 }))
  }
}
