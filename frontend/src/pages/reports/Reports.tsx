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

function formatDate(date: Date) {
  return date.toISOString().split('T')[0]
}

export default function Reports() {
  const today = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate() - 6)

  const [fromDate, setFromDate] = useState(formatDate(sevenDaysAgo))
  const [toDate, setToDate] = useState(formatDate(today))
  const [daily, setDaily] = useState<DailyData[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchReport() {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/reports/', {
        params: { from_date: fromDate, to_date: toDate },
      })
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

  function handleApply() {
    if (fromDate > toDate) {
      setError('Start date must be before end date.')
      return
    }
    fetchReport()
  }

  function applyPreset(days: number) {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - (days - 1))
    setFromDate(formatDate(start))
    setToDate(formatDate(end))
  }

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-md p-4 mb-6"
      >
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            onClick={handleApply}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold px-5 py-2 shadow-md hover:opacity-90 transition"
          >
            Apply
          </button>

          <div className="flex gap-2 ml-auto">
            <button onClick={() => applyPreset(7)} className="text-xs text-indigo-600 hover:underline">Last 7 days</button>
            <button onClick={() => applyPreset(30)} className="text-xs text-indigo-600 hover:underline">Last 30 days</button>
          </div>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </motion.div>

      {loading ? (
        <p className="text-center mt-10 text-gray-400">Loading report...</p>
      ) : (
        <>
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
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Calories</h2>
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
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Water Intake</h2>
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
        </>
      )}
    </div>
  )
}