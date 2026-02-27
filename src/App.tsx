import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from './context/AuthContext'

const SignInPage = lazy(() => import('./pages/SignIn'))
const OnboardingPage = lazy(() => import('./pages/Onboarding'))
const DashboardPage = lazy(() => import('./pages/Dashboard'))
const JourneyPage = lazy(() => import('./pages/Journey'))
const AvoidedItemsPage = lazy(() => import('./pages/AvoidedItems'))

function PageLoader() {
  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center">
      <Loader2 className="text-purple-400 animate-spin" size={28} />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/sign-in" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journey"
              element={
                <ProtectedRoute>
                  <JourneyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/avoided-items"
              element={
                <ProtectedRoute>
                  <AvoidedItemsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </BrowserRouter>
  )
}
