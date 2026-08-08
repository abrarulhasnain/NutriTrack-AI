import { useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../api/supabaseClient'
import { AuthContext, type AuthContextType } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthContextType['session']>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for an existing session on initial load or page refresh.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Keep the session in sync when the user logs in or out.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
