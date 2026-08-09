import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Apple, Trash2 } from 'lucide-react'
import api from '@/api/axiosInstance'

interface CustomFood {
  id: string
  name: string
  serving_size: number
  serving_unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
}

export default function CustomFoods() {
  const [foods, setFoods] = useState<CustomFood[]>([])
  const [formData, setFormData] = useState({
    name: '', serving_size: '', serving_unit: '', calories: '',
    protein: '', carbs: '', fat: '', fiber: '', sugar: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  async function fetchFoods() {
    try {
      const response = await api.get('/custom-foods/')
      setFoods(response.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchFoods()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/custom-foods/', {
        name: formData.name,
        serving_size: Number(formData.serving_size),
        serving_unit: formData.serving_unit,
        calories: Number(formData.calories),
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fat: Number(formData.fat),
        fiber: Number(formData.fiber),
        sugar: Number(formData.sugar),
      })

      setFormData({
        name: '', serving_size: '', serving_unit: '', calories: '',
        protein: '', carbs: '', fat: '', fiber: '', sugar: '',
      })

      await fetchFoods()
    } catch (err) {
      setError('Failed to create custom food. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/custom-foods/${id}`)
      await fetchFoods()
    } catch (err) {
      console.error(err)
    }
  }

  const inputClass = "w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Apple className="text-white" size={22} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">My Custom Foods</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Custom Food</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Food Name" value={formData.name} onChange={handleChange} className={inputClass} required />

          <div className="flex gap-2">
            <input name="serving_size" type="number" placeholder="Serving Size" value={formData.serving_size} onChange={handleChange} className={inputClass} required />
            <input name="serving_unit" placeholder="Unit (g, ml, piece)" value={formData.serving_unit} onChange={handleChange} className={inputClass} required />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input name="calories" type="number" placeholder="Calories" value={formData.calories} onChange={handleChange} className={inputClass} required />
            <input name="protein" type="number" placeholder="Protein" value={formData.protein} onChange={handleChange} className={inputClass} required />
            <input name="carbs" type="number" placeholder="Carbs" value={formData.carbs} onChange={handleChange} className={inputClass} required />
            <input name="fat" type="number" placeholder="Fat" value={formData.fat} onChange={handleChange} className={inputClass} required />
            <input name="fiber" type="number" placeholder="Fiber" value={formData.fiber} onChange={handleChange} className={inputClass} required />
            <input name="sugar" type="number" placeholder="Sugar" value={formData.sugar} onChange={handleChange} className={inputClass} required />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2.5 shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Add Custom Food'}
          </button>
        </form>
      </motion.div>

      <div className="space-y-3 pb-10">
        <h2 className="text-lg font-semibold text-gray-800">Saved Custom Foods</h2>

        {fetching && <p className="text-gray-400 text-sm">Loading...</p>}
        {!fetching && foods.length === 0 && (
          <p className="text-gray-400 text-sm">No custom foods yet. Add your first one above!</p>
        )}

        <AnimatePresence>
          {foods.map((food, index) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold text-gray-800">{food.name}</h3>
                <p className="text-xs text-gray-400">Per {food.serving_size}{food.serving_unit}</p>
                <p className="text-sm mt-1 text-gray-600">
                  {food.calories} cal | {food.protein}g protein | {food.carbs}g carbs | {food.fat}g fat
                </p>
              </div>
              <button onClick={() => handleDelete(food.id)} className="text-gray-400 hover:text-red-500 transition p-1">
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}