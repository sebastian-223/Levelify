import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Zap, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import ParticleCanvas from './_ParticleCanvas'
import Blob from './_Blob'

// Strength meter 
function StrengthBar({ password }) {
  const score = Math.min(4, Math.floor(password.length / 3))
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1 mb-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-white/10'}`}
          />
        ))}
      </div>
      {password && (
        <p className={`text-[11px] transition-colors ${['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400'][score]}`}>
          {labels[score]}
        </p>
      )}
    </div>
  )
}

// Step indicator
function StepDots({ current, total }) {
  return (
    <div className="flex gap-2 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor: i <= current ? '#7c3aed' : 'rgba(255,255,255,0.15)',
          }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  )
}

// Variants
const cardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
}

const fieldVariants = (delay) => ({
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay } },
})

const stepVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.25 } }),
}

// Shared input style helpers
const inputBase =
  'w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all duration-200'

const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
}

const focusStyle = {
  border: '1px solid rgba(124,58,237,0.6)',
  background: 'rgba(124,58,237,0.08)',
  boxShadow: '0 0 0 3px rgba(124,58,237,0.15)',
}

const blurStyle = {
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.06)',
  boxShadow: 'none',
}

function StyledInput({ icon: Icon, type = 'text', placeholder, value, onChange, rightSlot }) {
  return (
    <div className="relative group">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-violet-400 transition-colors pointer-events-none" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputBase + (rightSlot ? ' pr-12' : '')}
        style={inputStyle}
        onFocus={e => Object.assign(e.target.style, focusStyle)}
        onBlur={e => Object.assign(e.target.style, blurStyle)}
      />
      {rightSlot}
    </div>
  )
}

// RegisterPage
export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const goStep = (n) => { setDir(n - step > 0 ? 1 : -1); setStep(n) }

  const handleNext = () => {
    if (step === 0) {
      if (!form.name.trim()) { toast.error('Name required'); return }
      if (!form.email.trim()) { toast.error('Email required'); return }
      goStep(1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!form.password) { toast.error('Password required'); return }
    if (form.password.length < 6) { toast.error('Min 6 characters'); return }
    if (form.password !== form.confirm) { toast.error('Passwords don\'t match'); return }
    const result = await register({ name: form.name, email: form.email, password: form.password })
    if (result.success) {
      toast.success('Account created! Welcome 🚀')
      navigate('/')
    } else {
      toast.error(result.error || 'Registration failed')
    }
  }

  const passwordsMatch = form.confirm && form.password === form.confirm

  return (
    <div className="relative min-h-screen bg-[#050510] flex items-center justify-center p-4 overflow-hidden">
      <ParticleCanvas />

      <Blob className="w-[500px] h-[500px] bg-violet-700 -top-24 -left-24" xAnim={[0, 30, 0]} yAnim={[0, -20, 0]} delay={0} />
      <Blob className="w-[400px] h-[400px] bg-blue-700 -bottom-20 -right-20" xAnim={[0, -20, 0]} yAnim={[0, 30, 0]} delay={4} />
      <Blob className="w-[300px] h-[300px] bg-pink-700 top-1/2 left-[60%]" xAnim={[0, 15, 0]} yAnim={[0, 15, 0]} delay={7} />

      <div
        className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <motion.div
        className="absolute left-0 right-0 h-px z-[2] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent pointer-events-none"
        animate={{ top: ['-2px', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3 mb-7"
        >
          <motion.div
            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 0 0px rgba(124,58,237,0.6)', '0 0 0 14px rgba(124,58,237,0)', '0 0 0 0px rgba(124,58,237,0)'] }}
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
            <Zap className="w-7 h-7 text-white" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Levelify
            </h1>
            <p className="text-xs text-white/30 uppercase tracking-widest mt-0.5">Join 10,000+ learners</p>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div variants={cardVariants} initial="initial" animate="animate" className="w-full relative">
          <div className="absolute top-[-1px] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

          <div
            className="w-full rounded-3xl border border-white/10 p-8 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            <h2 className="text-[22px] font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              {step === 0 ? 'Create account ✨' : 'Set your password 🔐'}
            </h2>
            <p className="text-sm text-white/40 mb-6 font-light">
              {step === 0 ? 'Start your learning journey today' : 'Almost there! Secure your account'}
            </p>

            <StepDots current={step} total={2} />

            {/* Steps */}
            <AnimatePresence mode="wait" custom={dir}>
              {step === 0 ? (
                <motion.div
                  key="step0"
                  custom={dir}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-5"
                >
                  {/* Name */}
                  <motion.div variants={fieldVariants(0.5)} initial="initial" animate="animate">
                    <label className="text-[11px] font-medium uppercase tracking-widest text-white/40 block mb-2">
                      Full Name
                    </label>
                    <StyledInput
                      icon={User}
                      placeholder="John Doe"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    />
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={fieldVariants(0.6)} initial="initial" animate="animate">
                    <label className="text-[11px] font-medium uppercase tracking-widest text-white/40 block mb-2">
                      Email Address
                    </label>
                    <StyledInput
                      icon={Mail}
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="step1"
                  custom={dir}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-5"
                >
                  {/* Password */}
                  <motion.div variants={fieldVariants(0.5)} initial="initial" animate="animate">
                    <label className="text-[11px] font-medium uppercase tracking-widest text-white/40 block mb-2">
                      Password
                    </label>
                    <StyledInput
                      icon={Lock}
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPwd(p => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-1"
                        >
                          {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                    <StrengthBar password={form.password} />
                  </motion.div>

                  {/* Confirm */}
                  <motion.div variants={fieldVariants(0.6)} initial="initial" animate="animate">
                    <label className="text-[11px] font-medium uppercase tracking-widest text-white/40 block mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <StyledInput
                        icon={Lock}
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat password"
                        value={form.confirm}
                        onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                        rightSlot={
                          <>
                            {passwordsMatch && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute right-10 top-1/2 -translate-y-1/2"
                              >
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              </motion.div>
                            )}
                            <button
                              type="button"
                              onClick={() => setShowConfirm(p => !p)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-1"
                            >
                              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </>
                        }
                      />
                    </div>
                  </motion.div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        className="text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-xl px-3 py-2.5"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex gap-3 mt-7">
              {step > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => goStep(0)}
                  className="flex-1 py-3.5 rounded-xl text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  ← Back
                </motion.button>
              )}
              <motion.button
                onClick={handleNext}
                disabled={isLoading}
                whileHover={{ scale: 1.02, boxShadow: '0 12px 36px rgba(124,58,237,0.45)' }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 relative overflow-hidden"
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
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="relative z-10">{step === 0 ? 'Continue →' : 'Create Account 🚀'}</span>
                )}
              </motion.button>
            </div>

            {/* Login link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-sm text-white/30 mt-5"
            >
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Sign in
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
