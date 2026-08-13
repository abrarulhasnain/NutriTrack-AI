import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { supabase } from "@/api/supabaseClient"
import api from "@/api/axiosInstance"

export function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("Signing you in...")

  useEffect(() => {
    async function completeOAuthSignIn() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setStatus("Sign-in failed. Please try again.")
        return
      }

      const fullName =
        session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? ""
      const email = session.user.email ?? ""

      try {
          await api.post("/users/register", { email, full_name: fullName })
          } catch (error) {
            console.error("User registration failed:", error)
            setStatus("Registration failed. Please try again.")
            return
          }

      try {
        await api.get("/profiles/")
        navigate("/dashboard")
      } catch {
        navigate("/onboarding")
      }
    }

    completeOAuthSignIn()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 px-4">
      <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
      <p className="text-gray-600 text-sm text-center">{status}</p>
    </div>
  )
}
