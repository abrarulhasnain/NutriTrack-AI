import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/api/axiosInstance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto mt-10 p-6 space-y-8"
    >
      <h1 className="text-2xl font-bold">My Custom Foods</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Custom Food</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Food Name</Label>
              <Input id="name" name="name" placeholder="e.g. Homemade Daal" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="serving_size">Serving Size</Label>
                <Input id="serving_size" name="serving_size" type="number" value={formData.serving_size} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="serving_unit">Unit</Label>
                <Input id="serving_unit" name="serving_unit" placeholder="g, ml, piece" value={formData.serving_unit} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="calories">Calories</Label>
                <Input id="calories" name="calories" type="number" value={formData.calories} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input id="protein" name="protein" type="number" value={formData.protein} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input id="carbs" name="carbs" type="number" value={formData.carbs} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input id="fat" name="fat" type="number" value={formData.fat} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input id="fiber" name="fiber" type="number" value={formData.fiber} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sugar">Sugar (g)</Label>
                <Input id="sugar" name="sugar" type="number" value={formData.sugar} onChange={handleChange} required />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Add Custom Food'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Saved Custom Foods</h2>

        {fetching && <p className="text-muted-foreground text-sm">Loading...</p>}
        {!fetching && foods.length === 0 && (
          <p className="text-muted-foreground text-sm">No custom foods yet. Add your first one above!</p>
        )}

        <AnimatePresence>
          {foods.map((food, index) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="flex justify-between items-start p-4">
                  <div>
                    <h3 className="font-bold">{food.name}</h3>
                    <p className="text-xs text-muted-foreground">Per {food.serving_size}{food.serving_unit}</p>
                    <p className="text-sm mt-1">
                      {food.calories} cal | {food.protein}g protein | {food.carbs}g carbs | {food.fat}g fat
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(food.id)} className="text-red-500">
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}