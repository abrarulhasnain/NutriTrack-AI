import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { Layout } from '@/components/Layout'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Layout>{children}</Layout>
}
