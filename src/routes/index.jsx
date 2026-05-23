import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AuthLayout from '@/layouts/AuthLayout'
import AppLayout from '@/layouts/AppLayout'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'

const ld = (imp) => lazy(imp)

const LoginPage       = ld(() => import('@/pages/auth/LoginPage'))
const RegisterPage    = ld(() => import('@/pages/auth/RegisterPage'))
const DashboardPage   = ld(() => import('@/pages/DashboardPage'))
const RoadmapPage     = ld(() => import('@/pages/RoadmapPage'))
const DSAPage         = ld(() => import('@/pages/DSATrackerPage'))
const StreakPage      = ld(() => import('@/pages/StreakPage'))
const CertPage        = ld(() => import('@/pages/CertificationsPage'))
const TimerPage       = ld(() => import('@/pages/TimerPage'))
const AnalyticsPage   = ld(() => import('@/pages/AnalyticsPage'))
const NotesPage       = ld(() => import('@/pages/NotesPage'))
const ResourcesPage   = ld(() => import('@/pages/ResourcesPage'))
const AIPage          = ld(() => import('@/pages/AIAssistantPage'))
const SettingsPage    = ld(() => import('@/pages/SettingsPage'))

const Fallback = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute><AuthLayout /></PublicOnlyRoute>,
    children: [
      { path: '/login',    element: <Suspense fallback={<Fallback/>}><LoginPage /></Suspense> },
      { path: '/register', element: <Suspense fallback={<Fallback/>}><RegisterPage /></Suspense> },
    ],
  },
  {
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { path: '/',           element: <Suspense fallback={<Fallback/>}><DashboardPage /></Suspense> },
      { path: '/roadmap',    element: <Suspense fallback={<Fallback/>}><RoadmapPage /></Suspense> },
      { path: '/dsa',        element: <Suspense fallback={<Fallback/>}><DSAPage /></Suspense> },
      { path: '/streak',     element: <Suspense fallback={<Fallback/>}><StreakPage /></Suspense> },
      { path: '/certs',      element: <Suspense fallback={<Fallback/>}><CertPage /></Suspense> },
      { path: '/timer',      element: <Suspense fallback={<Fallback/>}><TimerPage /></Suspense> },
      { path: '/analytics',  element: <Suspense fallback={<Fallback/>}><AnalyticsPage /></Suspense> },
      { path: '/notes',      element: <Suspense fallback={<Fallback/>}><NotesPage /></Suspense> },
      { path: '/resources',  element: <Suspense fallback={<Fallback/>}><ResourcesPage /></Suspense> },
      { path: '/ai',         element: <Suspense fallback={<Fallback/>}><AIPage /></Suspense> },
      { path: '/settings',   element: <Suspense fallback={<Fallback/>}><SettingsPage /></Suspense> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
