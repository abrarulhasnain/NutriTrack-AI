import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { supabase } from "@/api/supabaseClient"
import api from "@/api/axiosInstance"

export function EmailConfirm() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("Confirming your account...")

  useEffect(() => {
    async function completeRegistration() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setStatus("Confirmation link is invalid or has expired.")
        return
      }

      const fullName = session.user.user_metadata?.full_name ?? ""
      const email = session.user.email ?? ""

      try {
        await api.post("/users/register", { email, full_name: fullName })
      } catch {
        setStatus("Account confirmed, but profile setup failed. Please contact support.")
        return
      }

      await supabase.auth.signOut()
      setStatus("Account confirmed. Redirecting to sign in...")
      setTimeout(() => navigate("/login"), 1500)
    }

    completeRegistration()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 px-4">
      <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
      <p className="text-gray-600 text-sm text-center">{status}</p>
    </div>
  )
}
