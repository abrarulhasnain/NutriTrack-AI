import { useState, useEffect } from 'react'
import api from '@/api/axiosInstance'

export default function WaterTracker() {
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0] // "2026-08-06" format

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
    setError('')
    setLoading(true)

    try {
      await api.post('/water/', {
        date: today,
        amount_ml: amount,
      })
      await fetchTotal()
    } catch (err) {
      setError('Failed to log water. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTotal()
  }, [])

  return (
    <div className="max-w-md mx-auto mt-10 p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Water Tracker</h1>

      <p className="text-4xl font-bold text-blue-600 mb-6">{total} ml</p>
      <p className="text-sm text-gray-500 mb-6">Today's total intake</p>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => addWater(250)}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          +250 ml
        </button>
        <button
          onClick={() => addWater(500)}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          +500 ml
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  )
}