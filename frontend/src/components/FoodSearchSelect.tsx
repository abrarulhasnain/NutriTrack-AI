import { useState, useRef, useEffect } from "react"
import type { Food } from "@/api/foodsCache"

interface FoodSearchSelectProps {
  foodsMap: Map<string, Food>
  selectedFoodId: string | null
  onSelect: (foodId: string, foodName: string) => void
}

export function FoodSearchSelect({ foodsMap, selectedFoodId, onSelect }: FoodSearchSelectProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedFoodId && foodsMap.has(selectedFoodId)) {
      setQuery(foodsMap.get(selectedFoodId)!.name)
    }
  }, [selectedFoodId, foodsMap])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const matches =
    query.trim().length > 0
      ? Array.from(foodsMap.values())
          .filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 8)
      : []

  function handleSelect(food: Food) {
    onSelect(food.id, food.name)
    setQuery(food.name)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search for a food..."
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {isOpen && matches.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {matches.map((food) => (
            <button
              key={food.id}
              type="button"
              onClick={() => handleSelect(food)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 flex justify-between"
            >
              <span>{food.name}</span>
              <span className="text-gray-400">{food.calories} kcal</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
