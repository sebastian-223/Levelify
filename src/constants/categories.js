// src/constants/categories.js
export const NOTE_CATEGORIES = [
  { id: 'all',           label: 'All Notes',      color: 'gray',   icon: '📋' },
  { id: 'dsa',           label: 'DSA',            color: 'blue',   icon: '🔢' },
  { id: 'frontend',      label: 'Frontend',       color: 'purple', icon: '🎨' },
  { id: 'backend',       label: 'Backend',        color: 'green',  icon: '⚙️' },
  { id: 'system-design', label: 'System Design',  color: 'orange', icon: '🏗️' },
  { id: 'aptitude',      label: 'Aptitude',       color: 'yellow', icon: '🧮' },
  { id: 'interview',     label: 'Interview Prep', color: 'red',    icon: '💼' },
  { id: 'projects',      label: 'Projects',       color: 'teal',   icon: '🚀' },
  { id: 'core',          label: 'Core Subjects',  color: 'cyan',   icon: '📚' },
  { id: 'placement',     label: 'Placement Prep', color: 'indigo', icon: '🎯' },
  { id: 'custom',        label: 'Custom',         color: 'gray',   icon: '📝' },
]

export const NOTE_COLORS = [
  { id: 'default', bg: 'bg-white dark:bg-surface-soft-dark', border: 'border-gray-200 dark:border-gray-700' },
  { id: 'blue',   bg: 'bg-blue-50 dark:bg-blue-950/30',   border: 'border-blue-200 dark:border-blue-800' },
  { id: 'purple', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800' },
  { id: 'green',  bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800' },
  { id: 'amber',  bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' },
  { id: 'red',    bg: 'bg-red-50 dark:bg-red-950/30',     border: 'border-red-200 dark:border-red-800' },
  { id: 'teal',   bg: 'bg-teal-50 dark:bg-teal-950/30',   border: 'border-teal-200 dark:border-teal-800' },
]

export const RESOURCE_CATEGORIES = [
  { id: 'all',           label: 'All',            icon: '🔖' },
  { id: 'dsa',           label: 'DSA',            icon: '💻' },
  { id: 'frontend',      label: 'Frontend',       icon: '🎨' },
  { id: 'backend',       label: 'Backend',        icon: '⚙️' },
  { id: 'system-design', label: 'System Design',  icon: '🏗️' },
  { id: 'aptitude',      label: 'Aptitude',       icon: '🧮' },
  { id: 'interview',     label: 'Interview Prep', icon: '💼' },
  { id: 'projects',      label: 'Projects',       icon: '🚀' },
  { id: 'placements',    label: 'Placements',     icon: '🎯' },
  { id: 'youtube',       label: 'YouTube',        icon: '▶️' },
  { id: 'docs',          label: 'Docs',           icon: '📄' },
  { id: 'courses',       label: 'Courses',        icon: '🎓' },
  { id: 'articles',      label: 'Articles',       icon: '📰' },
  { id: 'custom',        label: 'Custom',         icon: '🔗' },
]

export const DSA_TOPICS = [
  'Arrays','Strings','Hashing','Two Pointers','Sliding Window',
  'Stack','Queue','Linked List','Trees','Binary Search Trees',
  'Heaps','Graphs','BFS','DFS','Dynamic Programming',
  'Greedy','Backtracking','Binary Search','Recursion','Sorting',
  'Tries','Segment Trees','Bit Manipulation','Math','Geometry',
]

export const DSA_PLATFORMS = ['LeetCode','GeeksforGeeks','Codeforces','HackerRank','CodeChef','InterviewBit','Naukri Code360','SPOJ','AtCoder','Other']

export const TIMER_MODES = {
  focus:    { label: 'Focus',     duration: 25 * 60, color: 'primary', emoji: '🎯' },
  deepwork: { label: 'Deep Work', duration: 90 * 60, color: 'accent',  emoji: '🔥' },
  break:    { label: 'Break',     duration: 5 * 60,  color: 'green',   emoji: '☕' },
}

export const ROUTES = {
  LOGIN:     '/login',
  REGISTER:  '/register',
  DASHBOARD: '/',
  ROADMAP:   '/roadmap',
  DSA:       '/dsa',
  STREAK:    '/streak',
  CERTS:     '/certs',
  TIMER:     '/timer',
  ANALYTICS: '/analytics',
  NOTES:     '/notes',
  RESOURCES: '/resources',
  AI:        '/ai',
  SETTINGS:  '/settings',
}
