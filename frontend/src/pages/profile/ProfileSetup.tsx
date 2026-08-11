import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/api/axiosInstance'

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say']
const ACTIVITY_LEVEL_OPTIONS = [
  'Sedentary',
  'Lightly Active',
  'Moderately Active',
  'Very Active',
  'Extra Active',
]
const FITNESS_GOAL_OPTIONS = [
  'Lose Weight',
  'Maintain Weight',
  'Gain Weight',
  'Build Muscle',
]

function calculateBMI(heightCm: string, weightKg: string) {
  const h = Number(heightCm) / 100
  const w = Number(weightKg)
  if (!h || !w) return null

  const bmi = w / (h * h)
  let category = ''
  let color = ''

  if (bmi < 18.5) {
    category = 'Underweight'
    color = 'text-blue-500'
  } else if (bmi < 25) {
    category = 'Normal'
    color = 'text-green-500'
  } else if (bmi < 30) {
    category = 'Overweight'
    color = 'text-orange-500'
  } else {
    category = 'Obese'
    color = 'text-red-500'
  }

  return { value: bmi.toFixed(1), category, color }
}

export default function ProfileSetup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    activity_level: '',
    fitness_goal: '',
    calorie_goal: '',
    protein_goal: '',
    carbs_goal: '',
    fat_goal: '',
    water_goal: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  async function fetchExistingProfile() {
    try {
      const response = await api.get('/profiles/')
      const profile = response.data.data

      setFormData({
        full_name: profile.full_name,
        age: String(profile.age),
        gender: profile.gender,
        height_cm: String(profile.height_cm),
        weight_kg: String(profile.weight_kg),
        activity_level: profile.activity_level,
        fitness_goal: profile.fitness_goal,
        calorie_goal: String(profile.calorie_goal),
        protein_goal: String(profile.protein_goal),
        carbs_goal: String(profile.carbs_goal),
        fat_goal: String(profile.fat_goal),
        water_goal: String(profile.water_goal),
      })
      setIsEditing(true)
    } catch (err) {
      setIsEditing(false)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchExistingProfile()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      age: Number(formData.age),
      height_cm: Number(formData.height_cm),
      weight_kg: Number(formData.weight_kg),
      calorie_goal: Number(formData.calorie_goal),
      protein_goal: Number(formData.protein_goal),
      carbs_goal: Number(formData.carbs_goal),
      fat_goal: Number(formData.fat_goal),
      water_goal: Number(formData.water_goal),
    }

    try {
      if (isEditing) {
        await api.put('/profiles/', payload)
      } else {
        await api.post('/profiles/', payload)
      }
      toast.success(isEditing ? 'Profile updated!' : 'Profile saved!')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Something went wrong while saving your profile. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
  const selectClass = `${inputClass} bg-white appearance-none`
  const bmi = calculateBMI(formData.height_cm, formData.weight_kg)

  if (pageLoading) {
    return <p className="text-center mt-10 text-gray-400">Loading...</p>
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <UserCircle className="text-white" size={22} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit Your Profile' : 'Complete Your Profile'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="full_name" type="text" placeholder="Full Name" value={formData.full_name} onChange={handleChange} className={inputClass} required />
          <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} className={inputClass} required />

          <select name="gender" value={formData.gender} onChange={handleChange} className={selectClass} required>
            <option value="" disabled>Select Gender</option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <input name="height_cm" type="number" placeholder="Height (cm)" value={formData.height_cm} onChange={handleChange} className={inputClass} required />
          <input name="weight_kg" type="number" placeholder="Weight (kg)" value={formData.weight_kg} onChange={handleChange} className={inputClass} required />

          {bmi && (
            <div className="flex items-center justify-between bg-gray-50 rounded-full px-4 py-2 text-sm">
              <span className="text-gray-500">Your BMI</span>
              <span className={`font-bold ${bmi.color}`}>{bmi.value} · {bmi.category}</span>
            </div>
          )}

          <select name="activity_level" value={formData.activity_level} onChange={handleChange} className={selectClass} required>
            <option value="" disabled>Select Activity Level</option>
            {ACTIVITY_LEVEL_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select name="fitness_goal" value={formData.fitness_goal} onChange={handleChange} className={selectClass} required>
            <option value="" disabled>Select Fitness Goal</option>
            {FITNESS_GOAL_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <input name="calorie_goal" type="number" placeholder="Calorie Goal" value={formData.calorie_goal} onChange={handleChange} className={inputClass} required />
          <input name="protein_goal" type="number" placeholder="Protein Goal (g)" value={formData.protein_goal} onChange={handleChange} className={inputClass} required />
          <input name="carbs_goal" type="number" placeholder="Carbs Goal (g)" value={formData.carbs_goal} onChange={handleChange} className={inputClass} required />
          <input name="fat_goal" type="number" placeholder="Fat Goal (g)" value={formData.fat_goal} onChange={handleChange} className={inputClass} required />
          <input name="water_goal" type="number" placeholder="Water Goal (ml)" value={formData.water_goal} onChange={handleChange} className={inputClass} required />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2.5 shadow-md hover:opacity-90 transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Profile' : 'Save Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}