import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '@/api/axiosInstance'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WaterTracker() {
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto mt-10 p-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Water Tracker</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <motion.p
            key={total}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-5xl font-bold text-blue-600 mb-2"
          >
            {total} ml
          </motion.p>
          <p className="text-sm text-muted-foreground mb-6">Today's total intake</p>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => addWater(250)} disabled={loading}>
              +250 ml
            </Button>
            <Button onClick={() => addWater(500)} disabled={loading} variant="secondary">
              +500 ml
            </Button>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </CardContent>
      </Card>
    </motion.div>
  )
}