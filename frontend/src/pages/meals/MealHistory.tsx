import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import api from "@/api/axiosInstance"
import { getFoodsMap, type Food } from "@/api/foodsCache"
import { Skeleton } from "@/components/ui/skeleton"

interface MealItem {
  id: string
  food_id: string | null
  custom_food_id: string | null
  quantity: number
  unit: string
  calories: number
}

interface Meal {
  id: string
  meal_date: string
  meal_type: string
  original_text: string
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  created_at: string
  items: MealItem[]
}

export function MealHistory() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [foodsMap, setFoodsMap] = useState<Map<string, Food>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function loadData() {
    try {
      const [mealsResponse, foods] = await Promise.all([
        api.get("/meals/"),
        getFoodsMap(),
      ])
      setMeals(mealsResponse.data.data)
      setFoodsMap(foods)
    } catch {
      setError("Failed to load meal history. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function getFoodName(item: MealItem): string {
    if (item.food_id && foodsMap.has(item.food_id)) {
      return foodsMap.get(item.food_id)!.name
    }
    return "Unknown food"
  }

  async function handleDelete(mealId: string) {
    const confirmed = window.confirm("Delete this meal? This cannot be undone.")
    if (!confirmed) return

    setDeletingId(mealId)
    try {
      await api.delete(`/meals/${mealId}`)
      setMeals((prev) => prev.filter((meal) => meal.id !== mealId))
    } catch {
      setError("Failed to delete the meal. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-4 pb-10">
        <Skeleton className="h-7 w-40 mb-6" />
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between mb-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 pb-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Meal History</h1>

      {meals.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          No meals logged yet. Start by logging your first meal.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {meals.map((meal) => (
            <div key={meal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  {meal.meal_type}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{meal.meal_date}</span>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    disabled={deletingId === meal.id}
                    className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <ul className="flex flex-col gap-1 mb-3">
                {meal.items.map((item) => (
                  <li key={item.id} className="text-sm text-gray-600 flex justify-between">
                    <span>
                      {getFoodName(item)} — {item.quantity}{item.unit}
                    </span>
                    <span className="text-gray-400">{item.calories} kcal</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-4 pt-3 border-t border-gray-100 text-sm">
                <span className="font-semibold text-gray-700">{meal.total_calories} kcal</span>
                <span className="text-gray-500">{meal.total_protein}g protein</span>
                <span className="text-gray-500">{meal.total_carbs}g carbs</span>
                <span className="text-gray-500">{meal.total_fat}g fat</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
