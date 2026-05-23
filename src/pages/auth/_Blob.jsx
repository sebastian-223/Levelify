import { motion } from 'framer-motion'

export default function Blob({ className, xAnim, yAnim, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] opacity-30 pointer-events-none ${className}`}
      animate={{ x: xAnim, y: yAnim }}
      transition={{
        duration: 12,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
        delay,
      }}
      style={{ zIndex: 1 }}
    />
  )
}
