import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
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

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading report...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  const summaryCards = summary
    ? [
        { label: 'Avg Calories/day', value: summary.avg_calories },
        { label: 'Avg Protein/day', value: `${summary.avg_protein}g` },
        { label: 'Avg Carbs/day', value: `${summary.avg_carbs}g` },
        { label: 'Avg Water/day', value: `${summary.avg_water_ml}ml` },
      ]
    : []

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <BarChart3 className="text-white" size={22} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Weekly Report</h1>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="bg-white rounded-2xl shadow-md p-4 text-center"
          >
            <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {card.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Calories (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="calories" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Water Intake (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="water_ml" fill="#a855f7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}