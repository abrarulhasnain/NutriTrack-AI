import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import api from "@/api/axiosInstance"
import { getFoodsMap, type Food } from "@/api/foodsCache"
import { CircularProgress } from "@/components/CircularProgress"
import { WeeklyTrend } from "@/components/WeeklyTrend"
import { WaterWeeklyTrend } from "@/components/WaterWeeklyTrend"
import { MealSuggestion } from "@/components/MealSuggestion"
import { MealLoggerWidget } from "@/components/MealLoggerWidget"
import { DashboardSkeleton } from "@/components/DashboardSkeleton"
import { useAuth } from "@/context/useAuth"

interface NutrientProgress {
  consumed: number
  goal: number
}

interface WaterProgress {
  consumed_ml: number
  goal_ml: number
}

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
  meal_type: string
  total_calories: number
  items: MealItem[]
}

interface DashboardData {
  date: string
  calories: NutrientProgress
  protein: NutrientProgress
  carbs: NutrientProgress
  fat: NutrientProgress
  water: WaterProgress
  meals: Meal[]
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function Dashboard() {
  const { session } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [foodsMap, setFoodsMap] = useState<Map<string, Food>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fullName = session?.user.user_metadata?.full_name as string | undefined
  const firstName = fullName ? fullName.split(" ")[0] : "there"

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const loadDashboard = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0]

    try {
      const [dashboardResponse, foods] = await Promise.all([
        api.get("/dashboard/", { params: { target_date: today } }),
        getFoodsMap(),
      ])
      setData(dashboardResponse.data.data)
      setFoodsMap(foods)
    } catch {
      setError("Could not load your dashboard. Please make sure your profile is set up.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  function getFoodName(item: MealItem): string {
    if (item.food_id && foodsMap.has(item.food_id)) {
      return foodsMap.get(item.food_id)!.name
    }
    return "Unknown food"
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error || !data) {
    return <p className="text-center mt-10 text-red-500">{error}</p>
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-700">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-gray-400">{todayLabel}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6"
      >
        <MealLoggerWidget onMealLogged={loadDashboard} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6"
      >
        <MealSuggestion />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center mb-6"
      >
        <CircularProgress
          consumed={data.calories.consumed}
          goal={data.calories.goal}
          label="Calories"
          unit=" kcal"
          color="#6366f1"
          size={160}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
      >
        <CircularProgress consumed={data.protein.consumed} goal={data.protein.goal} label="Protein" unit="g" color="#8b5cf6" size={90} />
        <CircularProgress consumed={data.carbs.consumed} goal={data.carbs.goal} label="Carbs" unit="g" color="#f59e0b" size={90} />
        <CircularProgress consumed={data.fat.consumed} goal={data.fat.goal} label="Fat" unit="g" color="#ec4899" size={90} />
        <CircularProgress consumed={data.water.consumed_ml} goal={data.water.goal_ml} label="Water" unit="ml" color="#0ea5e9" size={90} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
      >
        <h2 className="text-sm font-semibold text-gray-500 mb-4">Weekly Calorie Trend</h2>
        <WeeklyTrend />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
      >
        <h2 className="text-sm font-semibold text-gray-500 mb-4">Weekly Water Trend</h2>
        <WaterWeeklyTrend />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <h2 className="text-sm font-semibold text-gray-500 mb-4">Today's Meals</h2>

        {data.meals.length === 0 ? (
          <p className="text-sm text-gray-400">No meals logged today yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.meals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                    {meal.meal_type}
                  </span>
                  <p className="text-sm text-gray-600">
                    {meal.items.map((item) => getFoodName(item)).join(", ")}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{meal.total_calories} kcal</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
