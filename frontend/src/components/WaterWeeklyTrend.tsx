import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import api from "@/api/axiosInstance"

interface DailyEntry {
  date: string
  water_ml: number
}

export function WaterWeeklyTrend() {
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
    water: entry.water_ml,
  }))

  if (loading) {
    return <p className="text-sm text-gray-400">Loading trend...</p>
  }

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            formatter={(value: number) => [`${value} ml`, "Water"]}
          />
          <Bar dataKey="water" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
