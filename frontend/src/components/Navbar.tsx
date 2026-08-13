import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, History, User, Droplet, ChefHat, Salad, BarChart3, LogOut, Menu } from "lucide-react"
import { useAuth } from "@/context/useAuth"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meals", label: "Meals", icon: History },
  { to: "/profile-setup", label: "Profile", icon: User },
  { to: "/water", label: "Water", icon: Droplet },
  { to: "/recipes", label: "Recipes", icon: ChefHat },
  { to: "/custom-foods", label: "Custom Foods", icon: Salad },
  { to: "/reports", label: "Reports", icon: BarChart3 },
]

export function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate("/login")
  }

  const Logo = (
    <div className="flex items-center gap-2">
      <img src="/logo-128.png" alt="NutriTrack AI" className="w-8 h-8 rounded-lg" />
      <span className="font-semibold text-gray-700">NutriTrack AI</span>
    </div>
  )

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {Logo}

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

        {/* Mobile menu trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col gap-1 mt-8">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}

              <button
                onClick={() => {
                  setOpen(false)
                  handleLogout()
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors mt-2 border-t border-gray-100 pt-4"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

