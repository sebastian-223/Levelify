import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Moon, Sun, Bell, Trash2, Shield, Palette } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { useDSAStore } from '@/store/dsaStore'
import { useNotesStore } from '@/store/notesStore'
import { useResourcesStore } from '@/store/resourcesStore'
import { Card, Button } from '@/components/ui/index'
import { toast } from 'sonner'
import { cn } from '@/utils/index'

function Section({ title, icon: Icon, children }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20">
          <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </Card>
  )
}

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuthStore()
  const { theme, toggleTheme } = useUIStore()
  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')

  const handleSaveProfile = () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return }
    updateProfile({ name })
    toast.success('Profile updated!')
  }

  const handleClearDSA = () => {
    if (confirm('Clear all DSA problems? This cannot be undone.')) {
      useDSAStore.setState({ problems: [] })
      toast.success('DSA data cleared')
    }
  }
  const handleClearNotes = () => {
    if (confirm('Clear all notes? This cannot be undone.')) {
      useNotesStore.setState({ notes: [] })
      toast.success('Notes cleared')
    }
  }
  const handleClearResources = () => {
    if (confirm('Clear all resources? This cannot be undone.')) {
      useResourcesStore.setState({ resources: [] })
      toast.success('Resources cleared')
    }
  }

  return (
    <div className="page-wrapper max-w-3xl">
      <div className="space-y-5">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Section title="Profile" icon={User}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shadow-glow-primary">
                {name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{name || 'User'}</p>
                <p className="text-sm text-gray-400">{email}</p>
                <p className="text-xs text-primary-500 mt-0.5">Free Plan</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Email</label>
                <input value={email} disabled className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/3 px-4 py-2.5 text-sm text-gray-500 dark:text-gray-500 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed in mock mode</p>
              </div>
              <Button onClick={handleSaveProfile}>Save Profile</Button>
            </div>
          </Section>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Section title="Appearance" icon={Palette}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Theme</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Currently using {theme} mode</p>
              </div>
              <button onClick={toggleTheme}
                className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border',
                  theme === 'dark'
                    ? 'bg-gray-900 text-white border-gray-700 hover:border-gray-500'
                    : 'bg-gray-100 text-gray-900 border-gray-200 hover:border-gray-300')}>
                {theme === 'dark' ? <><Sun className="w-4 h-4" /> Light Mode</> : <><Moon className="w-4 h-4" /> Dark Mode</>}
              </button>
            </div>
          </Section>
        </motion.div>

        {/* Data Management */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <Section title="Data Management" icon={Shield}>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                All data is stored locally in your browser. Clear individual sections below. This cannot be undone.
              </p>
              {[
                { label: 'Clear DSA Problems', desc: 'Remove all logged DSA problems', action: handleClearDSA, color: 'amber' },
                { label: 'Clear All Notes', desc: 'Delete all your study notes', action: handleClearNotes, color: 'amber' },
                { label: 'Clear All Resources', desc: 'Remove all saved resource links', action: handleClearResources, color: 'amber' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={item.action}>
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </Button>
                </div>
              ))}
            </div>
          </Section>
        </motion.div>

        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <Section title="Account" icon={Shield}>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Mock Authentication Mode</p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  This app uses local mock authentication. Replace <code className="font-mono">authService.js</code> with Firebase or your backend API to enable real authentication.
                </p>
              </div>
              <Button variant="danger" onClick={() => { logout(); window.location.href = '/login' }} className="w-full">
                Sign Out
              </Button>
            </div>
          </Section>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
          <Card className="p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-3 shadow-glow-primary">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white">Levelify v1.0.0</p>
            <p className="text-xs text-gray-400 mt-1">AI-Powered Learning & Career Growth Platform</p>
            <p className="text-xs text-gray-400 mt-0.5">Built with React + Vite + Tailwind + Framer Motion + Zustand</p>
            <div className="flex justify-center gap-3 mt-3">
              {['React 18', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Recharts'].map(tech => (
                <span key={tech} className="text-[10px] px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full">{tech}</span>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
