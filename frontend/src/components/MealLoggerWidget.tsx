import { useState, useEffect, useRef } from "react"
import { Send, Bot, User as UserIcon } from "lucide-react"
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

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  type: "text" | "confirm" | "typing"
  text?: string
  items?: ExtractedItem[]
  confirmed?: boolean
}

const mealTypes = ["breakfast", "lunch", "dinner", "snack"]

interface MealLoggerWidgetProps {
  onMealLogged: () => void
}

export function MealLoggerWidget({ onMealLogged }: MealLoggerWidgetProps) {
  const [foodsMap, setFoodsMap] = useState<Map<string, Food>>(new Map())
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      type: "text",
      text: "Tell me what you ate and I'll log it for you. For example: \"2 boiled eggs and a glass of milk\"",
    },
  ])
  const [text, setText] = useState("")
  const [mealType, setMealType] = useState("breakfast")
  const [analyzing, setAnalyzing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getFoodsMap().then(setFoodsMap)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  function addMessage(message: ChatMessage) {
    setMessages((prev) => [...prev, message])
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || analyzing) return

    const userText = text.trim()
    setText("")

    addMessage({ id: crypto.randomUUID(), role: "user", type: "text", text: userText })
    addMessage({ id: "typing", role: "assistant", type: "typing" })
    setAnalyzing(true)

    const today = new Date().toISOString().split("T")[0]

    try {
      const response = await api.post("/ai/extract", {
        text: userText,
        meal_type: mealType,
        log_date: today,
      })

      const result = response.data.data

      setMessages((prev) => prev.filter((m) => m.id !== "typing"))

      if (result.meal_created) {
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          type: "text",
          text: "Got it, logged your meal. Nicely done!",
        })
        onMealLogged()
      } else {
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          type: "confirm",
          text: "I couldn't confidently match everything. Please confirm below:",
          items: result.items,
        })
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== "typing"))
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        type: "text",
        text: "Sorry, I couldn't process that. Please try rephrasing.",
      })
    } finally {
      setAnalyzing(false)
    }
  }

  function updateItem(messageId: string, index: number, changes: Partial<ExtractedItem>) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId && m.items
          ? { ...m, items: m.items.map((item, i) => (i === index ? { ...item, ...changes } : item)) }
          : m
      )
    )
  }

  async function handleConfirm(message: ChatMessage) {
    if (!message.items) return

    const unresolvedItem = message.items.find((item) => !item.food_id)
    if (unresolvedItem) {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        type: "text",
        text: `Please select a food for "${unresolvedItem.extracted_name}" first.`,
      })
      return
    }

    const today = new Date().toISOString().split("T")[0]

    try {
      await api.post("/meals/", {
        meal_date: today,
        meal_type: mealType,
        original_text: message.items.map((i) => i.extracted_name).join(", "),
        items: message.items.map((item) => ({
          food_id: item.food_id,
          quantity: item.quantity,
          unit: item.unit,
        })),
      })

      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, confirmed: true } : m)))
      addMessage({ id: crypto.randomUUID(), role: "assistant", type: "text", text: "Logged! Nicely done." })
      onMealLogged()
    } catch {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        type: "text",
        text: "Something went wrong logging that meal. Please try again.",
      })
    }
  }

  return (
    <div className="flex flex-col h-[420px]">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-500">Log a meal</h2>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {mealTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                message.role === "user" ? "bg-gray-100" : "bg-indigo-50"
              }`}
            >
              {message.role === "user" ? (
                <UserIcon className="w-3.5 h-3.5 text-gray-500" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-indigo-500" />
              )}
            </div>

            {message.type === "typing" ? (
              <div className="bg-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-400">Thinking...</div>
            ) : message.type === "confirm" ? (
              <div className="max-w-[85%] flex flex-col gap-2">
                <div className="bg-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-700">{message.text}</div>
                <div className="flex flex-col gap-2">
                  {message.items?.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-100 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">"{item.extracted_name}"</span>
                        {item.matched ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600">Matched</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Confirm</span>
                        )}
                      </div>
                      <FoodSearchSelect
                        foodsMap={foodsMap}
                        selectedFoodId={item.food_id}
                        onSelect={(foodId) => updateItem(message.id, index, { food_id: foodId })}
                      />
                      <div className="flex gap-2 mt-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(message.id, index, { quantity: Number(e.target.value) })}
                          className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-xs outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => updateItem(message.id, index, { unit: e.target.value })}
                          className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-xs outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                    </div>
                  ))}
                  {!message.confirmed && (
                    <Button
                      onClick={() => handleConfirm(message)}
                      className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-xs h-8"
                    >
                      Confirm & Log Meal
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  message.role === "user"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type what you ate..."
          className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <Button
          type="submit"
          disabled={analyzing || !text.trim()}
          className="rounded-full bg-indigo-500 hover:bg-indigo-600 px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
