import { motion } from "framer-motion"

interface CircularProgressProps {
  consumed: number
  goal: number
  label: string
  unit: string
  color: string
  size?: number
}

export function CircularProgress({ consumed, goal, label, unit, color, size = 120 }: CircularProgressProps) {
  const strokeWidth = size * 0.09
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = goal > 0 ? Math.min(consumed / goal, 1) : 0

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - percentage) }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-700">{Math.round(consumed)}</span>
          <span className="text-xs text-gray-400">/ {Math.round(goal)}{unit}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-500">{label}</span>
    </div>
  )
}
