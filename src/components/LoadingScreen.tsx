'use client'

import { useProgress } from '@react-three/drei'

export function LoadingScreen() {
  const { progress, active } = useProgress()
  
  if (!active) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#e8e8ec]">
      <div className="flex flex-col items-center gap-6">
        {/* Car icon */}
        <div className="text-6xl animate-bounce">🚗</div>
        
        {/* Loading text */}
        <h2 className="text-2xl font-bold text-gray-800">Loading Car Model...</h2>
        
        {/* Progress bar container */}
        <div className="w-80 h-3 bg-gray-300 rounded-full overflow-hidden">
          {/* Progress bar fill */}
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Percentage text */}
        <p className="text-gray-600 text-lg font-medium">
          {progress.toFixed(0)}%
        </p>
        
        {/* Tip text */}
        <p className="text-gray-400 text-sm mt-4">
          Tip: You can rotate the car by dragging
        </p>
      </div>
    </div>
  )
}

export default LoadingScreen
