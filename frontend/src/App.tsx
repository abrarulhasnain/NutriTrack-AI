import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { ProtectedRoute } from './context/ProtectedRoute'
import { AuthPage } from './pages/auth/AuthPage'
import { AuthCallback } from './pages/auth/AuthCallback'
import { Dashboard } from './pages/dashboard/Dashboard'
import { MealHistory } from './pages/meals/MealHistory'
import { AiMealLogger } from './pages/meals/AiMealLogger'
import ProfileSetup from './pages/profile/ProfileSetup'
import WaterTracker from './pages/water/WaterTracker'
import Recipes from './pages/recipes/Recipes'
import CustomFoods from './pages/customFoods/CustomFoods'
import Reports from './pages/reports/Reports'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meals"
            element={
              <ProtectedRoute>
                <MealHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meals/log"
            element={
              <ProtectedRoute>
                <AiMealLogger />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/water"
            element={
              <ProtectedRoute>
                <WaterTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <Recipes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-foods"
            element={
              <ProtectedRoute>
                <CustomFoods />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
