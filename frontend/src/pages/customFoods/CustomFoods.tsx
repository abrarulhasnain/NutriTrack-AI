import { useState, useEffect } from 'react'
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
    name: '',
    serving_size: '',
    serving_unit: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sugar: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchFoods() {
    try {
      const response = await api.get('/custom-foods/')
      setFoods(response.data.data)
    } catch (err) {
      console.error(err)
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
        name: '',
        serving_size: '',
        serving_unit: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        sugar: '',
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

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">My Custom Foods</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-10 border p-4 rounded">
        <h2 className="text-lg font-semibold">Add Custom Food</h2>

        <input name="name" placeholder="Food Name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />

        <div className="flex gap-2">
          <input name="serving_size" type="number" placeholder="Serving Size" value={formData.serving_size} onChange={handleChange} className="flex-1 border p-2 rounded" required />
          <input name="serving_unit" placeholder="Unit (g, ml, piece)" value={formData.serving_unit} onChange={handleChange} className="flex-1 border p-2 rounded" required />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input name="calories" type="number" placeholder="Calories" value={formData.calories} onChange={handleChange} className="border p-2 rounded" required />
          <input name="protein" type="number" placeholder="Protein (g)" value={formData.protein} onChange={handleChange} className="border p-2 rounded" required />
          <input name="carbs" type="number" placeholder="Carbs (g)" value={formData.carbs} onChange={handleChange} className="border p-2 rounded" required />
          <input name="fat" type="number" placeholder="Fat (g)" value={formData.fat} onChange={handleChange} className="border p-2 rounded" required />
          <input name="fiber" type="number" placeholder="Fiber (g)" value={formData.fiber} onChange={handleChange} className="border p-2 rounded" required />
          <input name="sugar" type="number" placeholder="Sugar (g)" value={formData.sugar} onChange={handleChange} className="border p-2 rounded" required />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? 'Saving...' : 'Add Custom Food'}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Saved Custom Foods</h2>
        {foods.length === 0 && <p className="text-gray-500 text-sm">No custom foods yet.</p>}

        {foods.map((food) => (
          <div key={food.id} className="border p-4 rounded flex justify-between items-start">
            <div>
              <h3 className="font-bold">{food.name}</h3>
              <p className="text-xs text-gray-400">Per {food.serving_size}{food.serving_unit}</p>
              <p className="text-sm mt-1">
                {food.calories} cal | {food.protein}g protein | {food.carbs}g carbs | {food.fat}g fat
              </p>
            </div>
            <button onClick={() => handleDelete(food.id)} className="text-red-500 text-sm">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}