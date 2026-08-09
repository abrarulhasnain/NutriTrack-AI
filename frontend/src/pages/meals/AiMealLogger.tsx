import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axiosInstance"
import { getFoodsMap, type Food } from "@/api/foodsCache"
import { Button } from "@/components/ui/button"
import { FoodSearchSelect } from "@/components/FoodSearchSelect"

interface ExtractedItem {
  extracted_name: string
  quantity: number
  unit: string
  food_id: string | null
  matched_food_name: string | null
  confidence: number
  matched: boolean
}

const mealTypes = ["breakfast", "lunch", "dinner", "snack"]

export function AiMealLogger() {
  const navigate = useNavigate()
  const [foodsMap, setFoodsMap] = useState<Map<string, Food>>(new Map())
  const [text, setText] = useState("")
  const [mealType, setMealType] = useState("breakfast")
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split("T")[0])
  const [items, setItems] = useState<ExtractedItem[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    getFoodsMap().then(setFoodsMap)
  }, [])

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setItems([])
    setAnalyzing(true)

    try {
      const response = await api.post("/ai/extract", {
        text,
        meal_type: mealType,
        log_date: logDate,
      })

      const result = response.data.data

      if (result.meal_created) {
        setSuccessMessage("Meal logged successfully.")
        setTimeout(() => navigate("/meals"), 1200)
      } else {
        setItems(result.items)
      }
    } catch {
      setError("Could not analyze the meal text. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  function updateItem(index: number, changes: Partial<ExtractedItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...changes } : item)))
  }

  async function handleConfirm() {
    setError("")

    const unresolvedItem = items.find((item) => !item.food_id)
    if (unresolvedItem) {
      setError(`Please select a food for "${unresolvedItem.extracted_name}" before confirming.`)
      return
    }

    setSubmitting(true)

    try {
      await api.post("/meals/", {
        meal_date: logDate,
        meal_type: mealType,
        original_text: text,
        items: items.map((item) => ({
          food_id: item.food_id,
          quantity: item.quantity,
          unit: item.unit,
        })),
      })

      setSuccessMessage("Meal logged successfully.")
      setTimeout(() => navigate("/meals"), 1200)
    } catch {
      setError("Failed to log the meal. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 pb-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Log a Meal</h1>

      <form onSubmit={handleAnalyze} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe what you ate, e.g. 2 boiled eggs and a glass of milk"
          required
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />

        <div className="flex gap-3">
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {mealTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

        <Button type="submit" disabled={analyzing} className="rounded-full bg-indigo-500 hover:bg-indigo-600">
          {analyzing ? "Analyzing..." : "Analyze Meal"}
        </Button>
      </form>

      {items.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">
            Confirm the items below before logging your meal
          </h2>

          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <div key={index} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">"{item.extracted_name}"</span>
                  {item.matched ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600">Matched</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Needs confirmation</span>
                  )}
                </div>

                <FoodSearchSelect
                  foodsMap={foodsMap}
                  selectedFoodId={item.food_id}
                  onSelect={(foodId) => updateItem(index, { food_id: foodId })}
                />

                <div className="flex gap-3 mt-3">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })}
                    className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => updateItem(index, { unit: e.target.value })}
                    className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full rounded-full bg-indigo-500 hover:bg-indigo-600 mt-5"
          >
            {submitting ? "Logging..." : "Confirm & Log Meal"}
          </Button>
        </div>
      )}
    </div>
  )
}
