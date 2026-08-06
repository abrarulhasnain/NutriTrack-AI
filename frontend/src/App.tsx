import { AuthProvider } from './context/AuthProvider'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-green-500">
          NutriTrack AI — Auth Ready
        </h1>
      </div>
    </AuthProvider>
  )
}

export default App