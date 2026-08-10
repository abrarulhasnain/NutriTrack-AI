import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { UserCircle } from "lucide-react"
import api from "@/api/axiosInstance"

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"]
const ACTIVITY_LEVEL_OPTIONS = [
  "Sedentary",
  "Lightly Active",
  "Moderately Active",
  "Very Active",
  "Extra Active",
]
const FITNESS_GOAL_OPTIONS = [
  "Lose Weight",
  "Maintain Weight",
  "Gain Weight",
  "Build Muscle",
]

interface FormData {
  full_name: string
  age: string
  gender: string
  height_cm: string
  weight_kg: string
  activity_level: string
  fitness_goal: string
  calorie_goal: string
  protein_goal: string
  carbs_goal: string
  fat_goal: string
  water_goal: string
}

const TOTAL_STEPS = 4

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  )
}

export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggesting, setSuggesting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    activity_level: "",
    fitness_goal: "",
    calorie_goal: "",
    protein_goal: "",
    carbs_goal: "",
    fat_goal: "",
    water_goal: "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function isStepValid(): boolean {
    if (step === 1) return !!(formData.full_name && formData.age && formData.gender)
    if (step === 2) return !!(formData.height_cm && formData.weight_kg && formData.activity_level)
    if (step === 3) return !!formData.fitness_goal
    if (step === 4)
      return !!(
        formData.calorie_goal &&
        formData.protein_goal &&
        formData.carbs_goal &&
        formData.fat_goal &&
        formData.water_goal
      )
    return false
  }

  useEffect(() => {
    if (step !== 4) return
    if (formData.calorie_goal) return

    async function fetchSuggestedGoals() {
      setSuggesting(true)
      try {
        const response = await api.post("/profiles/suggest-goals", {
          age: Number(formData.age),
          gender: formData.gender,
          height_cm: Number(formData.height_cm),
          weight_kg: Number(formData.weight_kg),
          activity_level: formData.activity_level,
          fitness_goal: formData.fitness_goal,
        })
        const goals = response.data.data
        setFormData((prev) => ({
          ...prev,
          calorie_goal: String(goals.calorie_goal),
          protein_goal: String(goals.protein_goal),
          carbs_goal: String(goals.carbs_goal),
          fat_goal: String(goals.fat_goal),
          water_goal: String(goals.water_goal),
        }))
      } catch {
        // Suggestion is a convenience - if it fails, the user can still fill in manually.
      } finally {
        setSuggesting(false)
      }
    }

    fetchSuggestedGoals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  function handleNext() {
    setError("")
    if (!isStepValid()) {
      setError("Please fill in all fields before continuing.")
      return
    }
    setStep((prev) => prev + 1)
  }

  function handleBack() {
    setError("")
    setStep((prev) => prev - 1)
  }

  async function handleSubmit() {
    setError("")
    if (!isStepValid()) {
      setError("Please fill in all fields before continuing.")
      return
    }

    setLoading(true)
    try {
      await api.post("/profiles/", {
        ...formData,
        age: Number(formData.age),
        height_cm: Number(formData.height_cm),
        weight_kg: Number(formData.weight_kg),
        calorie_goal: Number(formData.calorie_goal),
        protein_goal: Number(formData.protein_goal),
        carbs_goal: Number(formData.carbs_goal),
        fat_goal: Number(formData.fat_goal),
        water_goal: Number(formData.water_goal),
      })
      navigate("/dashboard")
    } catch {
      setError("Something went wrong while saving your profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
  const selectClass = `${inputClass} bg-white appearance-none`

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <UserCircle className="text-white" size={22} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Let's set up your profile</h1>
        </div>

        <div className="flex gap-1 mb-6 mt-4">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < step ? "bg-indigo-500" : "bg-gray-100"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3"
          >
            {step === 1 && (
              <>
                <h2 className="text-sm font-semibold text-gray-500 mb-1">About you</h2>
                <Field label="Full Name">
                  <input name="full_name" type="text" placeholder="e.g. Abrar ul Hasnain" value={formData.full_name} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Age">
                  <input name="age" type="number" placeholder="e.g. 25" value={formData.age} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Gender">
                  <select name="gender" value={formData.gender} onChange={handleChange} className={selectClass}>
                    <option value="" disabled>Select Gender</option>
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-sm font-semibold text-gray-500 mb-1">Body & activity</h2>
                <Field label="Height (cm)">
                  <input name="height_cm" type="number" placeholder="e.g. 175" value={formData.height_cm} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Weight (kg)">
                  <input name="weight_kg" type="number" placeholder="e.g. 70" value={formData.weight_kg} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Activity Level">
                  <select name="activity_level" value={formData.activity_level} onChange={handleChange} className={selectClass}>
                    <option value="" disabled>Select Activity Level</option>
                    {ACTIVITY_LEVEL_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </Field>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-sm font-semibold text-gray-500 mb-1">Your goal</h2>
                <Field label="Fitness Goal">
                  <select name="fitness_goal" value={formData.fitness_goal} onChange={handleChange} className={selectClass}>
                    <option value="" disabled>Select Fitness Goal</option>
                    {FITNESS_GOAL_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </Field>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-sm font-semibold text-gray-500 mb-1">Daily targets</h2>
                {suggesting && (
                  <p className="text-xs text-indigo-500 mb-1">Calculating suggested goals for you...</p>
                )}
                <Field label="Calories (kcal)">
                  <input name="calorie_goal" type="number" placeholder="e.g. 2000" value={formData.calorie_goal} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Protein (g)">
                  <input name="protein_goal" type="number" placeholder="e.g. 150" value={formData.protein_goal} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Carbs (g)">
                  <input name="carbs_goal" type="number" placeholder="e.g. 200" value={formData.carbs_goal} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Fat (g)">
                  <input name="fat_goal" type="number" placeholder="e.g. 65" value={formData.fat_goal} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Water (ml)">
                  <input name="water_goal" type="number" placeholder="e.g. 2500" value={formData.water_goal} onChange={handleChange} className={inputClass} />
                </Field>
                <p className="text-xs text-gray-400 mt-1">
                  These are suggested based on your details. Feel free to adjust them.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 rounded-full border border-gray-200 text-gray-600 font-medium py-2.5 hover:bg-gray-50 transition"
            >
              Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              onClick={handleNext}
              className="flex-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2.5 shadow-md hover:opacity-90 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2.5 shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Finish"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
