// import { Outlet } from 'react-router-dom'
// import { motion } from 'framer-motion'

// export default function AuthLayout() {
//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gray-950 flex items-center justify-center p-4">
//       {/* Animated background blobs */}
//       <div className="absolute inset-0 overflow-hidden">
//         <motion.div
//           animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
//           transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
//           className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl"
//         />
//         <motion.div
//           animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
//           transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
//           className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl"
//         />
//         <motion.div
//           animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
//           transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl"
//         />
//         {/* Grid pattern */}
//         <div className="absolute inset-0 opacity-[0.03]" style={{
//           backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
//           backgroundSize: '40px 40px'
//         }} />
//       </div>
//       <div className="relative z-10 w-full">
//         <Outlet />
//       </div>
//     </div>
//   )
// }

import { Outlet } from 'react-router-dom'

// AuthLayout now just provides the outlet — 
// background/animations are handled inside each page (Login/Register)
// so each page has full control over its own scene
export default function AuthLayout() {
  return <Outlet />
}
