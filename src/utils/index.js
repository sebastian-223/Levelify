//cn
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Date formatters
export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(dateStr)
}

export function formatSeconds(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function formatHours(seconds) {
  if (!seconds || seconds <= 0) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

// Streak
export function generateHeatmapData(activityLog = {}, weeks = 26) {
  const today = new Date()
  const data = []
  for (let w = weeks - 1; w >= 0; w--) {
    const week = []
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today)
      date.setDate(today.getDate() - (w * 7 + d))
      const key = date.toISOString().split('T')[0]
      week.push({ date: key, count: activityLog[key] || 0 })
    }
    data.push(week.reverse())
  }
  return data
}

export function getHeatmapColor(count) {
  if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
  if (count === 1) return 'bg-primary-200 dark:bg-primary-900'
  if (count <= 3) return 'bg-primary-400 dark:bg-primary-700'
  if (count <= 6) return 'bg-primary-500 dark:bg-primary-500'
  return 'bg-primary-700 dark:bg-primary-400'
}

// Local storage helpers 
export function storageGet(key, fallback = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage write failed:', e)
  }
}
