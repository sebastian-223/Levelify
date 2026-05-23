import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { useUIStore } from '@/store/uiStore'

export default function AppLayout() {
  const sidebarOpen = useUIStore(s => s.sidebarOpen)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark flex">
      <Sidebar />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
