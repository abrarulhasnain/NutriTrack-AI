import { useState, useEffect } from 'react'
import api from '@/api/axiosInstance'

interface RecipeItem {
  food_id: string
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
  const [items, setItems] = useState<RecipeItem[]>([{ food_id: '', quantity: 0, unit: 'g' }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchRecipes() {
    try {
      const response = await api.get('/recipes/')
      setRecipes(response.data.data)
    } catch (err) {
      console.error(err)
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

  function addItemRow() {
    setItems([...items, { food_id: '', quantity: 0, unit: 'g' }])
  }

  function removeItemRow(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
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

    console.log('Sending this data:', payload)

    try {
      await api.post('/recipes/', payload)

      // Reset form
      setName('')
      setDescription('')
      setServings(1)
      setItems([{ food_id: '', quantity: 0, unit: 'g' }])

      await fetchRecipes()
    } catch (err) {
      setError('Failed to create recipe. Check your food IDs and try again.')
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

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">My Recipes</h1>

      {/* Create Recipe Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-10 border p-4 rounded">
        <h2 className="text-lg font-semibold">Create New Recipe</h2>

        <input
          placeholder="Recipe Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Servings"
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
          className="w-full border p-2 rounded"
          required
        />

        <div>
          <p className="text-sm font-medium mb-2">Ingredients</p>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                placeholder="Food ID"
                value={item.food_id}
                onChange={(e) => updateItem(index, 'food_id', e.target.value)}
                className="flex-1 border p-2 rounded text-sm"
                required
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                className="w-20 border p-2 rounded text-sm"
                required
              />
              <input
                placeholder="Unit"
                value={item.unit}
                onChange={(e) => updateItem(index, 'unit', e.target.value)}
                className="w-16 border p-2 rounded text-sm"
                required
              />
              {items.length > 1 && (
                <button type="button" onClick={() => removeItemRow(index)} className="text-red-500 px-2">
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItemRow} className="text-blue-600 text-sm">
            + Add Ingredient
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? 'Creating...' : 'Create Recipe'}
        </button>
      </form>

      {/* Recipes List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Saved Recipes</h2>
        {recipes.length === 0 && <p className="text-gray-500 text-sm">No recipes yet.</p>}

        {recipes.map((recipe) => (
          <div key={recipe.id} className="border p-4 rounded flex justify-between items-start">
            <div>
              <h3 className="font-bold">{recipe.name}</h3>
              <p className="text-sm text-gray-600">{recipe.description}</p>
              <p className="text-sm mt-1">
                {recipe.total_calories} cal | {recipe.total_protein}g protein | {recipe.total_carbs}g carbs | {recipe.total_fat}g fat
              </p>
              <p className="text-xs text-gray-400">Servings: {recipe.servings}</p>
            </div>
            <button onClick={() => handleDelete(recipe.id)} className="text-red-500 text-sm">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}