import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import ProfileSetup from './pages/profile/ProfileSetup'
import Login from './pages/auth/Login'
import WaterTracker from './pages/water/WaterTracker'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/water" element={<WaterTracker />} />
          <Route path="/" element={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-green-500">
                NutriTrack AI — Auth Ready
              </h1>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App