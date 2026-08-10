import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Droplet } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/api/axiosInstance'

export default function WaterTracker() {
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  async function fetchTotal() {
    try {
      const response = await api.get('/water/total', {
        params: { log_date: today },
      })
      setTotal(response.data.data.total_ml)
    } catch (err) {
      console.error(err)
    }
  }

  async function addWater(amount: number) {
    setLoading(true)

    try {
      await api.post('/water/', {
        date: today,
        amount_ml: amount,
      })
      await fetchTotal()
      toast.success(`Added ${amount}ml!`)
    } catch (err) {
      toast.error('Failed to log water. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTotal()
  }, [])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Droplet className="text-white" size={28} />
        </div>

        <h1 className="text-xl font-bold text-gray-800 mb-1">Water Tracker</h1>
        <p className="text-sm text-gray-400 mb-6">Today's total intake</p>

        <motion.p
          key={total}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8"
        >
          {total} ml
        </motion.p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => addWater(250)}
            disabled={loading}
            className="flex-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2.5 shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            +250 ml
          </button>
          <button
            onClick={() => addWater(500)}
            disabled={loading}
            className="flex-1 rounded-full border-2 border-indigo-500 text-indigo-600 font-semibold py-2.5 hover:bg-indigo-50 transition disabled:opacity-50"
          >
            +500 ml
          </button>
        </div>
      </motion.div>
    </div>
  )
}