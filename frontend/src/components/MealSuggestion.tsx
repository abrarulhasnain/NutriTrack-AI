import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import api from "@/api/axiosInstance"

export function MealSuggestion() {
  const [suggestion, setSuggestion] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api
      .get("/ai/suggestion")
      .then((response) => {
        setSuggestion(response.data.data.suggestion)
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-sm text-gray-400">Getting a suggestion for you...</p>
  }

  if (error || !suggestion) {
    return null
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4 text-indigo-500" />
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{suggestion}</p>
    </div>
  )
}
