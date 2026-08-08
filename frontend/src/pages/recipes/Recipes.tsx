import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/api/axiosInstance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

    try {
      await api.post('/recipes/', payload)

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto mt-10 p-6 space-y-8"
    >
      <h1 className="text-2xl font-bold">My Recipes</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create New Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="recipe-name">Recipe Name</Label>
              <Input id="recipe-name" placeholder="e.g. Chicken Biryani Bowl" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="recipe-description">Description</Label>
              <Input id="recipe-description" placeholder="Optional" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="recipe-servings">Servings</Label>
              <Input id="recipe-servings" type="number" value={servings} onChange={(e) => setServings(Number(e.target.value))} required />
            </div>

            <div>
              <Label className="mb-2 block">Ingredients</Label>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Food ID"
                      value={item.food_id}
                      onChange={(e) => updateItem(index, 'food_id', e.target.value)}
                      className="flex-1 text-sm"
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      className="w-20 text-sm"
                      required
                    />
                    <Input
                      placeholder="Unit"
                      value={item.unit}
                      onChange={(e) => updateItem(index, 'unit', e.target.value)}
                      className="w-16 text-sm"
                      required
                    />
                    {items.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItemRow(index)} className="text-red-500">
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button type="button" variant="link" onClick={addItemRow} className="px-0 mt-1">
                + Add Ingredient
              </Button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Create Recipe'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Saved Recipes</h2>

        {fetching && <p className="text-muted-foreground text-sm">Loading...</p>}
        {!fetching && recipes.length === 0 && (
          <p className="text-muted-foreground text-sm">No recipes yet. Create your first one above!</p>
        )}

        <AnimatePresence>
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="flex justify-between items-start p-4">
                  <div>
                    <h3 className="font-bold">{recipe.name}</h3>
                    <p className="text-sm text-muted-foreground">{recipe.description}</p>
                    <p className="text-sm mt-1">
                      {recipe.total_calories} cal | {recipe.total_protein}g protein | {recipe.total_carbs}g carbs | {recipe.total_fat}g fat
                    </p>
                    <p className="text-xs text-muted-foreground">Servings: {recipe.servings}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(recipe.id)} className="text-red-500">
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