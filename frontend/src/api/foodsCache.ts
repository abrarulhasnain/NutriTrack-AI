import api from "./axiosInstance"

export interface Food {
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

let foodsCache: Map<string, Food> | null = null

/**
 * Fetches the full reference food list once and caches it in memory.
 * Subsequent calls return the cached map without hitting the backend again.
 */
export async function getFoodsMap(): Promise<Map<string, Food>> {
  if (foodsCache) {
    return foodsCache
  }

  const response = await api.get("/foods/")
  const foods: Food[] = response.data.data

  foodsCache = new Map(foods.map((food) => [food.id, food]))
  return foodsCache
}
