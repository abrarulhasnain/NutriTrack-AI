import { useState } from 'react'
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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/profiles/', {
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
    
      window.location.href = '/'
    } catch (err) {
      setError('Error while saving profile. Try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="full_name" placeholder="Full Name" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="age" type="number" placeholder="Age" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="gender" placeholder="Gender" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="height_cm" type="number" placeholder="Height (cm)" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="weight_kg" type="number" placeholder="Weight (kg)" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="activity_level" placeholder="Activity Level" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="fitness_goal" placeholder="Fitness Goal" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="calorie_goal" type="number" placeholder="Calorie Goal" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="protein_goal" type="number" placeholder="Protein Goal" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="carbs_goal" type="number" placeholder="Carbs Goal" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="fat_goal" type="number" placeholder="Fat Goal" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="water_goal" type="number" placeholder="Water Goal (ml)" onChange={handleChange} className="w-full border p-2 rounded" required />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}