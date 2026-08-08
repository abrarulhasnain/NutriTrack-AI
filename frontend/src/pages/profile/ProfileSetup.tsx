import { useState, useEffect } from 'react'
import api from '@/api/axiosInstance'

export default function ProfileSetup() {
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
  const [error, setError] = useState('')
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
      // Profile doesn't exist yet — that's fine, keep the form empty
      setIsEditing(false)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchExistingProfile()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
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
      window.location.href = '/'
    } catch (err) {
      setError('Something went wrong while saving your profile. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return <p className="text-center mt-10">Loading...</p>
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? 'Edit Your Profile' : 'Complete Your Profile'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="height_cm" type="number" placeholder="Height (cm)" value={formData.height_cm} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="weight_kg" type="number" placeholder="Weight (kg)" value={formData.weight_kg} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="activity_level" placeholder="Activity Level" value={formData.activity_level} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="fitness_goal" placeholder="Fitness Goal" value={formData.fitness_goal} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="calorie_goal" type="number" placeholder="Calorie Goal" value={formData.calorie_goal} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="protein_goal" type="number" placeholder="Protein Goal" value={formData.protein_goal} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="carbs_goal" type="number" placeholder="Carbs Goal" value={formData.carbs_goal} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="fat_goal" type="number" placeholder="Fat Goal" value={formData.fat_goal} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="water_goal" type="number" placeholder="Water Goal (ml)" value={formData.water_goal} onChange={handleChange} className="w-full border p-2 rounded" required />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? 'Saving...' : isEditing ? 'Update Profile' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}