import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Trash2, X } from 'lucide-react'
import api from '@/api/axiosInstance'
import FoodSearchInput from '@/components/shared/FoodSearchInput'

interface RecipeItem {
  food_id: string
  food_name: string
  quantity: number
  unit: string
}

interface Recipe {
  id: string
  name: string
  description: string | null
  servings: number
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [servings, setServings] = useState(1)
  const [items, setItems] = useState<RecipeItem[]>([{ food_id: '', food_name: '', quantity: 0, unit: 'g' }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  async function fetchRecipes() {
    try {
      const response = await api.get('/recipes/')
      setRecipes(response.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  function updateItem(index: number, field: keyof RecipeItem, value: string | number) {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  function handleFoodSelect(index: number, foodId: string, foodName: string) {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], food_id: foodId, food_name: foodName }
    setItems(newItems)
  }

  function addItemRow() {
    setItems([...items, { food_id: '', food_name: '', quantity: 0, unit: 'g' }])
  }

  function removeItemRow(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (items.some((item) => !item.food_id)) {
      setError('Please select a valid food for each ingredient from the dropdown.')
      return
    }

    setLoading(true)

    const payload = {
      name,
      description,
      servings: Number(servings),
      items: items.map((item) => ({
        food_id: item.food_id,
        quantity: Number(item.quantity),
        unit: item.unit,
      })),
    }

    try {
      await api.post('/recipes/', payload)

      setName('')
      setDescription('')
      setServings(1)
      setItems([{ food_id: '', food_name: '', quantity: 0, unit: 'g' }])

      await fetchRecipes()
    } catch (err) {
      setError('Failed to create recipe. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/recipes/${id}`)
      await fetchRecipes()
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
          <ChefHat className="text-white" size={22} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">My Recipes</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Recipe</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input placeholder="Recipe Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
          <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
          <input type="number" placeholder="Servings" value={servings} onChange={(e) => setServings(Number(e.target.value))} className={inputClass} required />

          <div>
            <p className="text-sm font-medium text-gray-600 mb-2 px-1">Ingredients</p>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-[1fr_80px_64px_auto] gap-2 items-center">
                  <FoodSearchInput
                    value={item.food_name}
                    onSelect={(foodId, foodName) => handleFoodSelect(index, foodId, foodName)}
                    placeholder="Search food (e.g. chicken)"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className={inputClass}
                    required
                  />
                  <input
                    placeholder="Unit"
                    value={item.unit}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    className={inputClass}
                    required
                  />
                  {items.length > 1 ? (
                    <button type="button" onClick={() => removeItemRow(index)} className="text-gray-400 hover:text-red-500 transition p-1">
                      <X size={18} />
                    </button>
                  ) : (
                    <span></span>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addItemRow} className="text-indigo-600 text-sm font-medium mt-2 px-1 hover:underline">
              + Add Ingredient
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2.5 shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Recipe'}
          </button>
        </form>
      </motion.div>

      <div className="space-y-3 pb-10">
        <h2 className="text-lg font-semibold text-gray-800">Saved Recipes</h2>

        {fetching && <p className="text-gray-400 text-sm">Loading...</p>}
        {!fetching && recipes.length === 0 && (
          <p className="text-gray-400 text-sm">No recipes yet. Create your first one above!</p>
        )}

        <AnimatePresence>
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold text-gray-800">{recipe.name}</h3>
                <p className="text-sm text-gray-500">{recipe.description}</p>
                <p className="text-sm mt-1 text-gray-600">
                  {recipe.total_calories} cal | {recipe.total_protein}g protein | {recipe.total_carbs}g carbs | {recipe.total_fat}g fat
                </p>
                <p className="text-xs text-gray-400">Servings: {recipe.servings}</p>
              </div>
              <button onClick={() => handleDelete(recipe.id)} className="text-gray-400 hover:text-red-500 transition p-1">
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}