import { Suspense, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from '@/routes'
import { useUIStore } from '@/store/uiStore'

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-primary animate-pulse">
          <span className="text-white font-bold text-lg">L</span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-600 animate-pulse">Loading Levelify...</p>
      </div>
    </div>
  )
}

export default function App() {
  const theme = useUIStore(s => s.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          style: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
        }}
      />
    </>
  )
}
