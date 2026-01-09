'use client'

import dynamic from 'next/dynamic'
import ConfigPanel from '@/components/ConfigPanel'
import LoadingScreen from '@/components/LoadingScreen'
import { useStore } from '@/store/useStore'

// Dynamic import to avoid SSR issues with Three.js
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-[#e8e8ec]">
      <div className="text-gray-700 text-xl">Initializing...</div>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Loading Progress Bar */}
      <LoadingScreen />
      
      {/* 3D Canvas Background */}
      <Scene />
      
      {/* Configuration Panel Overlay */}
      <ConfigPanel />
      
      {/* Title Overlay */}
      <div className="fixed top-4 left-4 z-10">
        <h1 className="text-3xl font-bold text-gray-800 drop-shadow-sm">
          🚗 Car Configurator
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Customize colors & place decals
        </p>
      </div>
      
      {/* Mode Indicator */}
      <ModeIndicator />
    </main>
  )
}

// Mode indicator component
function ModeIndicator() {
  const decalMode = useStore((state) => state.decalMode)
  const selectedDecalTexture = useStore((state) => state.selectedDecalTexture)
  
  if (!decalMode) return null
  
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-purple-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
        <span className="animate-pulse w-3 h-3 bg-white rounded-full"></span>
        <span className="font-medium">
          {selectedDecalTexture 
            ? 'Click on the car to place decal' 
            : 'Select a decal from the panel'}
        </span>
      </div>
    </div>
  )
}
