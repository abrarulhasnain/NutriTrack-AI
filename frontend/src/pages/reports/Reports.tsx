import { useState, useEffect } from 'react'
import api from '@/api/axiosInstance'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DailyData {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  water_ml: number
}

interface Summary {
  days_count: number
  total_calories: number
  avg_calories: number
  total_protein: number
  avg_protein: number
  total_carbs: number
  avg_carbs: number
  total_fat: number
  avg_fat: number
  total_water_ml: number
  avg_water_ml: number
}

export default function Reports() {
  const [daily, setDaily] = useState<DailyData[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchReport() {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/reports/')
      setDaily(response.data.data.daily)
      setSummary(response.data.data.summary)
    } catch (err) {
      setError('Failed to load report.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  if (loading) return <p className="text-center mt-10">Loading report...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Weekly Report</h1>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border rounded p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.avg_calories}</p>
            <p className="text-xs text-gray-500">Avg Calories/day</p>
          </div>
          <div className="border rounded p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.avg_protein}g</p>
            <p className="text-xs text-gray-500">Avg Protein/day</p>
          </div>
          <div className="border rounded p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{summary.avg_carbs}g</p>
            <p className="text-xs text-gray-500">Avg Carbs/day</p>
          </div>
          <div className="border rounded p-4 text-center">
            <p className="text-2xl font-bold text-cyan-600">{summary.avg_water_ml}ml</p>
            <p className="text-xs text-gray-500">Avg Water/day</p>
          </div>
        </div>
      )}

      {/* Calories Chart */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Calories (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="calories" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Water Chart */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Water Intake (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="water_ml" fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}