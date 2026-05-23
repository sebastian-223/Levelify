import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import ParticleCanvas from './_ParticleCanvas'
import Blob from './_Blob'

function StrengthBar({ password }) {
  const score = Math.min(4, Math.floor(password.length / 3))
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400']
  return (
    <div className="flex gap-1 mt-2 h-[3px]">
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className={`flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-white/10'}`}
        />
      ))}
    </div>
  )
}

const onFocusInput = e => {
  e.target.style.border = '1px solid rgba(124,58,237,0.6)'
  e.target.style.background = 'rgba(124,58,237,0.08)'
  e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'
}
const onBlurInput = e => {
  e.target.style.border = '1px solid rgba(255,255,255,0.1)'
  e.target.style.background = 'rgba(255,255,255,0.06)'
  e.target.style.boxShadow = 'none'
}

const inputBase = 'w-full pl-10 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all duration-200'
const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 } },
  shake: { x: [-8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.4 } },
}

const field = (delay) => ({
  initial: { opacity: 0, x: -14 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay } },
})

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [shake, setShake] = useState(false)
  const { login, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Fill all fields'); return }
    const result = await login(form.email, form.password)
    if (result.success) { toast.success('Welcome back! 🎉'); navigate('/') }
    else { setShake(true); setTimeout(() => setShake(false), 500); toast.error(result.error || 'Login failed') }
  }

  const fillDemo = () => {
    setForm({ email: 'demo@levelify.app', password: 'demo123' })
    clearError?.()
    toast.success('Demo credentials filled! 🚀')
  }

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{ width: '100vw', height: '100vh', background: '#050510' }}
    >
      {/* Background layers */}
      <ParticleCanvas />
      <Blob className="w-[420px] h-[420px] bg-violet-700 -top-20 -left-20" xAnim={[0, 25, 0]} yAnim={[0, -15, 0]} delay={0} />
      <Blob className="w-[340px] h-[340px] bg-blue-700 -bottom-16 -right-16" xAnim={[0, -18, 0]} yAnim={[0, 25, 0]} delay={4} />
      <Blob className="w-[260px] h-[260px] bg-pink-700" style={{ top: '50%', left: '62%' }} xAnim={[0, 12, 0]} yAnim={[0, 12, 0]} delay={7} />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
          zIndex: 1,
        }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(124,58,237,0.5),transparent)', zIndex: 2 }}
        animate={{ top: ['-2px', '100vh'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* MAIN CONTENT */}
      <div
        className="relative flex flex-col items-center"
        style={{ zIndex: 10, width: '100%', maxWidth: 420, padding: '0 16px' }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2 mb-5"
        >
          <motion.div
            className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 0 0px rgba(124,58,237,0.6)', '0 0 0 12px rgba(124,58,237,0)', '0 0 0 0px rgba(124,58,237,0)'] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
          >
            <motion.div
              className="absolute inset-[-2px] rounded-[18px]"
              style={{
                background: 'linear-gradient(135deg,#7c3aed,#2563eb,#db2777,#7c3aed)',
                backgroundSize: '300% 300%',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                padding: '2px',
              }}
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <Zap className="w-6 h-6 text-white relative z-10" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne',sans-serif" }}>
              Levelify
            </h1>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">AI Learning Platform</p>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate={shake ? 'shake' : 'animate'}
          className="w-full relative"
        >
          {/* Top glow line */}
          <div className="absolute top-[-1px] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />

          <div
            className="w-full rounded-2xl border border-white/10"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              padding: '24px 24px 20px',
            }}
          >
            <h2 className="text-lg font-bold text-white mb-0.5" style={{ fontFamily: "'Syne',sans-serif" }}>
              Welcome back 👋
            </h2>
            <p className="text-xs text-white/40 mb-5 font-light">Sign in to continue your learning journey</p>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <motion.div variants={field(0.45)} initial="initial" animate="animate" className="mb-4">
                <label className="text-[10px] font-medium uppercase tracking-widest text-white/40 block mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-white/30 group-focus-within:text-violet-400 transition-colors pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className={`${inputBase} pr-4`}
                    style={inputStyle}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={field(0.55)} initial="initial" animate="animate" className="mb-1">
                <label className="text-[10px] font-medium uppercase tracking-widest text-white/40 block mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-white/30 group-focus-within:text-violet-400 transition-colors pointer-events-none" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className={`${inputBase} pr-11`}
                    style={inputStyle}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-1"
                  >
                    {showPwd ? <EyeOff className="w-[15px] h-[15px]" /> : <Eye className="w-[15px] h-[15px]" />}
                  </button>
                </div>
                <StrengthBar password={form.password} />
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-xl px-3 py-2 mt-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.div variants={field(0.65)} initial="initial" animate="animate" className="mt-4">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.015, boxShadow: '0 10px 32px rgba(124,58,237,0.45)' }}
                  whileTap={{ scale: 0.975 }}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                  />
                  {isLoading ? (
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 bg-white rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="relative z-10">Sign In →</span>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={field(0.72)} initial="initial" animate="animate" className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-[10px] text-white/25 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </motion.div>

            {/* Demo */}
            <motion.button
              variants={field(0.78)} initial="initial" animate="animate"
              onClick={fillDemo}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl text-sm text-white/55 hover:text-white border border-white/10 hover:border-white/22 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              🚀 Use Demo Account
            </motion.button>

            {/* Register */}
            <motion.p variants={field(0.84)} initial="initial" animate="animate" className="text-center text-xs text-white/30 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Create account
              </Link>
            </motion.p>
          </div>
        </motion.div>

        {/* Demo hint */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="text-[10px] text-white/15 mt-3 text-center"
        >
        </motion.p>
      </div>
    </div>
  )
}