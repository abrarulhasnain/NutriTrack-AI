import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@/api/axiosInstance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong while saving your profile. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return <p className="text-center mt-10 text-muted-foreground">Loading...</p>
  }

  const fields: { name: keyof typeof formData; label: string; type?: string }[] = [
    { name: 'full_name', label: 'Full Name' },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'gender', label: 'Gender' },
    { name: 'height_cm', label: 'Height (cm)', type: 'number' },
    { name: 'weight_kg', label: 'Weight (kg)', type: 'number' },
    { name: 'activity_level', label: 'Activity Level' },
    { name: 'fitness_goal', label: 'Fitness Goal' },
    { name: 'calorie_goal', label: 'Calorie Goal', type: 'number' },
    { name: 'protein_goal', label: 'Protein Goal (g)', type: 'number' },
    { name: 'carbs_goal', label: 'Carbs Goal (g)', type: 'number' },
    { name: 'fat_goal', label: 'Fat Goal (g)', type: 'number' },
    { name: 'water_goal', label: 'Water Goal (ml)', type: 'number' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto mt-10 p-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEditing ? 'Edit Your Profile' : 'Complete Your Profile'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type || 'text'}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? 'Saving...' : isEditing ? 'Update Profile' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}