// src/components/ui/index.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/index'

// ── Button ─────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', loading, className, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-glow-primary',
    secondary: 'bg-gray-100 dark:bg-white/8 hover:bg-gray-200 dark:hover:bg-white/12 text-gray-700 dark:text-gray-200',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-gray-200 dark:border-gray-700 hover:border-primary-400 bg-transparent text-gray-700 dark:text-gray-300',
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' }
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={loading || props.disabled} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}

// ── Card ───────────────────────────────────────────────────────────
export function Card({ children, className, glass, hover, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      className={cn(
        'rounded-2xl border transition-all duration-200',
        glass
          ? 'bg-white/70 dark:bg-white/5 backdrop-blur-md border-white/20 dark:border-white/10 shadow-glass dark:shadow-glass-dark'
          : 'bg-white dark:bg-surface-card-dark border-gray-200 dark:border-gray-800 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ── Input ──────────────────────────────────────────────────────────
export function Input({ label, error, icon: Icon, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
        <input
          className={cn(
            'w-full rounded-xl border bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-600',
            'outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 dark:focus:border-primary-400 transition-all',
            Icon && 'pl-10',
            error && 'border-red-400 focus:ring-red-400/30',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── Textarea ───────────────────────────────────────────────────────
export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <textarea
        className={cn(
          'w-full rounded-xl border bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100',
          'placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none',
          'outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 dark:focus:border-primary-400 transition-all',
          error && 'border-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── Select ─────────────────────────────────────────────────────────
export function Select({ label, error, className, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <select
        className={cn(
          'w-full rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100',
          'outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── Badge ──────────────────────────────────────────────────────────
export function Badge({ children, color = 'gray', className }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold', colors[color], className)}>
      {children}
    </span>
  )
}

// ── ProgressBar ────────────────────────────────────────────────────
export function ProgressBar({ value = 0, max = 100, color = 'primary', size = 'md', showLabel, className }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }
  const colors = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    accent: 'bg-accent-500',
  }
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden', heights[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', colors[color])}
        />
      </div>
      {showLabel && <p className="text-xs text-gray-500 mt-1">{Math.round(pct)}%</p>}
    </div>
  )
}

// ── Skeleton ───────────────────────────────────────────────────────
export function Skeleton({ className }) {
  return <div className={cn('animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl', className)} />
}

// ── Modal ──────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn('relative w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden', sizes[size])}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ── EmptyState ─────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">{description}</p>
      {action}
    </motion.div>
  )
}

// ── StatCard ───────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'primary', trend, suffix = '' }) {
  const colors = {
    primary: { bg: 'bg-primary-50 dark:bg-primary-900/20', text: 'text-primary-600 dark:text-primary-400' },
    green:   { bg: 'bg-green-50 dark:bg-green-900/20',   text: 'text-green-600 dark:text-green-400' },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-900/20',   text: 'text-amber-600 dark:text-amber-400' },
    red:     { bg: 'bg-red-50 dark:bg-red-900/20',       text: 'text-red-600 dark:text-red-400' },
    purple:  { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
    blue:    { bg: 'bg-blue-50 dark:bg-blue-900/20',     text: 'text-blue-600 dark:text-blue-400' },
  }
  const c = colors[color] || colors.primary
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2.5 rounded-xl', c.bg)}>
          <Icon className={cn('w-5 h-5', c.text)} />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}{suffix}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </Card>
  )
}
