import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '@/api/axiosInstance'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  if (loading) return <p className="text-center mt-10 text-muted-foreground">Loading report...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  const summaryCards = summary
    ? [
        { label: 'Avg Calories/day', value: summary.avg_calories, color: 'text-blue-600' },
        { label: 'Avg Protein/day', value: `${summary.avg_protein}g`, color: 'text-green-600' },
        { label: 'Avg Carbs/day', value: `${summary.avg_carbs}g`, color: 'text-orange-600' },
        { label: 'Avg Water/day', value: `${summary.avg_water_ml}ml`, color: 'text-cyan-600' },
      ]
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto mt-10 p-6"
    >
      <h1 className="text-2xl font-bold mb-6">Weekly Report</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
          >
            <Card>
              <CardContent className="text-center p-4">
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calories (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="calories" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Water Intake (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="water_ml" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}