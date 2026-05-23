import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, Code2, Flame, Award, Timer,
  BarChart3, StickyNote, Link2, Bot, Settings, LogOut,
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/roadmap',   icon: Map,             label: 'Roadmap' },
  { to: '/dsa',       icon: Code2,           label: 'DSA Tracker' },
  { to: '/streak',    icon: Flame,           label: 'Streak' },
  { to: '/certs',     icon: Award,           label: 'Certifications' },
  { to: '/timer',     icon: Timer,           label: 'Study Timer' },
  { to: '/analytics', icon: BarChart3,       label: 'Analytics' },
  { to: '/notes',     icon: StickyNote,      label: 'Notes' },
  { to: '/resources', icon: Link2,           label: 'Resources' },
  { to: '/ai',        icon: Bot,             label: 'AI Assistant' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 64 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full z-40 flex flex-col bg-white dark:bg-surface-card-dark border-r border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-gray-100 dark:border-gray-800 min-h-[64px]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-glow-primary">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="font-bold text-gray-900 dark:text-white tracking-tight text-lg truncate"
                >
                  Levelify
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                ${isActive
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`
              }
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="truncate"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-gray-100 dark:border-gray-800 space-y-0.5">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isActive ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`
            }
          >
            <Settings className="w-[18px] h-[18px] flex-shrink-0" />
            <AnimatePresence>{sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">Settings</motion.span>}</AnimatePresence>
          </NavLink>
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : undefined}
            className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            <AnimatePresence>{sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">Logout</motion.span>}</AnimatePresence>
          </button>
          {/* User avatar */}
          {sidebarOpen && (
            <div className="flex items-center gap-2.5 px-2.5 py-2 mt-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email || ''}</p>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  )
}
