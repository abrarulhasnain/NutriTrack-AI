import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/api/supabaseClient"
import api from "@/api/axiosInstance"

export function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("Confirming your account...")

  useEffect(() => {
    async function completeRegistration() {
      // After clicking the confirmation link, Supabase sets an active
      // session automatically. Retrieve it to access the user's details.
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setStatus("Confirmation link is invalid or has expired.")
        return
      }

      const fullName = session.user.user_metadata?.full_name ?? ""
      const email = session.user.email ?? ""

      try {
        await api.post("/users/register", {
          email,
          full_name: fullName,
        })
      } catch {
        setStatus("Account confirmed, but profile setup failed. Please contact support.")
        return
      }

      // Sign out so the user signs in explicitly on the login screen.
      await supabase.auth.signOut()

      setStatus("Account confirmed. Redirecting to sign in...")
      setTimeout(() => navigate("/login"), 1500)
    }

    completeRegistration()
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-white text-lg">{status}</p>
    </div>
  )
}
