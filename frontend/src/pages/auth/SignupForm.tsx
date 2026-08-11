import { useState } from "react"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/api/supabaseClient"
import { Button } from "@/components/ui/button"
import { SocialButtons } from "./SocialButtons"

export function SignupForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setMessage("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    // Create the account in Supabase Auth. The user's full name is stored
    // in user_metadata so it can be read later during backend registration.
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    setMessage("Account created. Please check your email to confirm your account before signing in.")
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-4xl font-bold text-gray-700 mb-8">Create Account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-100 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-100 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-11 pr-11 py-3 rounded-full bg-gray-100 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-100 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {message && <p className="text-sm text-green-600 text-center">{message}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="rounded-full bg-indigo-500 hover:bg-indigo-600 py-6 mt-2"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <SocialButtons />
    </div>
  )
}
