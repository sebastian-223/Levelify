import { useLocation } from 'react-router-dom'
import { Sun, Moon, Bell, Menu } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'

const PAGE_TITLES = {
  '/':          'Dashboard',
  '/roadmap':   'Roadmap Planner',
  '/dsa':       'DSA Tracker',
  '/streak':    'Coding Streak',
  '/certs':     'Certifications',
  '/timer':     'Study Timer',
  '/analytics': 'Analytics',
  '/notes':     'Smart Notes',
  '/resources': 'Resource Manager',
  '/ai':        'AI Assistant',
  '/settings':  'Settings',
}

export default function TopBar() {
  const { theme, toggleTheme, toggleSidebar } = useUIStore()
  const user = useAuthStore(s => s.user)
  const { pathname } = useLocation()

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-surface-card-dark/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900 dark:text-white leading-none">
            {PAGE_TITLES[pathname] || 'Levelify'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold ml-1">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
