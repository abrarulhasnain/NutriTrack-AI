import { useState, useEffect, useRef } from 'react'
import api from '@/api/axiosInstance'

interface Food {
  id: string
  name: string
  serving_size: number
  serving_unit: string
}

interface Props {
  value: string
  onSelect: (foodId: string, foodName: string) => void
  placeholder?: string
}

export default function FoodSearchInput({ value, onSelect, placeholder }: Props) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<Food[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = e.target.value
    setQuery(newQuery)
    setShowDropdown(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      if (newQuery.trim().length < 2) {
        setResults([])
        return
      }
      try {
        const response = await api.get('/foods/', { params: { search: newQuery } })
        setResults(response.data.data)
      } catch (err) {
        console.error(err)
      }
    }, 300)
  }

  function handleSelect(food: Food) {
    setQuery(food.name)
    setShowDropdown(false)
    setResults([])
    onSelect(food.id, food.name)
  }

  return (
    <div className="relative w-full">
      <input
        placeholder={placeholder || 'Search food...'}
        value={query}
        onChange={handleChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        className="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        required
      />

      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 max-h-56 overflow-y-auto">
          {results.map((food) => (
            <button
              key={food.id}
              type="button"
              onClick={() => handleSelect(food)}
              className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm transition"
            >
              <span className="font-medium text-gray-800">{food.name}</span>
              <span className="text-gray-400 text-xs ml-2">
                ({food.serving_size}{food.serving_unit})
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}