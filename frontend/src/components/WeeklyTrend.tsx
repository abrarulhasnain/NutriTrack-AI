import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import api from "@/api/axiosInstance"

interface DailyEntry {
  date: string
  calories: number
}

export function WeeklyTrend() {
  const [daily, setDaily] = useState<DailyEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/reports/")
      .then((response) => {
        setDaily(response.data.data.daily)
      })
      .catch(() => {
        setDaily([])
      })
      .finally(() => setLoading(false))
  }, [])

  const chartData = daily.map((entry) => ({
    day: new Date(entry.date).toLocaleDateString(undefined, { weekday: "short" }),
    calories: entry.calories,
  }))

  if (loading) {
    return <p className="text-sm text-gray-400">Loading trend...</p>
  }

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            formatter={(value) => [`${value ?? 0} kcal`, "Calories"]}
          />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 3, fill: "#6366f1" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

