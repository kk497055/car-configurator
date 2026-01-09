'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, useProgress } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'

function Loader() {
  const { progress, errors, active, loaded, total } = useProgress()
  
  return (
    <Html center>
      <div className="bg-black/80 text-white p-6 rounded-lg min-w-[300px]">
        <h2 className="text-xl font-bold mb-4">Loading Model...</h2>
        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm">Progress: {progress.toFixed(1)}%</p>
        <p className="text-sm">Loaded: {loaded} / {total}</p>
        <p className="text-sm">Active: {active ? 'Yes' : 'No'}</p>
        {errors.length > 0 && (
          <div className="mt-2 text-red-400">
            <p>Errors:</p>
            {errors.map((e, i) => <p key={i} className="text-xs">{e}</p>)}
          </div>
        )}
      </div>
    </Html>
  )
}

function PorscheModel() {
  const [error, setError] = useState<string | null>(null)
  
  try {
    const { scene } = useGLTF('/models/1992_porsche_911_964_turbo_s_3.6.glb')
    
    useEffect(() => {
      console.log('Porsche model loaded:', scene)
      console.log('Children count:', scene.children.length)
      scene.traverse((child) => {
        console.log('Child:', child.type, child.name)
      })
    }, [scene])
    
    return (
      <primitive 
        object={scene} 
        scale={1}
        position={[0, 0, 0]}
      />
    )
  } catch (e) {
    console.error('Error loading model:', e)
    return (
      <Html center>
        <div className="bg-red-500 text-white p-4 rounded">
          Error: {String(e)}
        </div>
      </Html>
    )
  }
}

function ToyCarModel() {
  const { scene } = useGLTF('/models/car.glb')
  
  useEffect(() => {
    console.log('ToyCar model loaded:', scene)
  }, [scene])
  
  return (
    <primitive 
      object={scene} 
      scale={50}
      position={[0, 0, 0]}
    />
  )
}

export default function TestPage() {
  const [selectedModel, setSelectedModel] = useState<'porsche' | 'toycar' | 'none'>('none')
  
  return (
    <div className="w-full h-screen bg-gray-900">
      {/* Model selector */}
      <div className="fixed top-4 left-4 z-10 bg-white/10 backdrop-blur p-4 rounded-lg">
        <h1 className="text-white text-xl font-bold mb-4">GLB Model Test</h1>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setSelectedModel('porsche')}
            className={`px-4 py-2 rounded ${selectedModel === 'porsche' ? 'bg-blue-500' : 'bg-gray-600'} text-white`}
          >
            Load Porsche 911 (5.3MB)
          </button>
          <button
            onClick={() => setSelectedModel('toycar')}
            className={`px-4 py-2 rounded ${selectedModel === 'toycar' ? 'bg-blue-500' : 'bg-gray-600'} text-white`}
          >
            Load ToyCar (5.8MB)
          </button>
          <button
            onClick={() => setSelectedModel('none')}
            className={`px-4 py-2 rounded ${selectedModel === 'none' ? 'bg-blue-500' : 'bg-gray-600'} text-white`}
          >
            Clear
          </button>
        </div>
        <p className="text-white/60 text-sm mt-4">
          Check browser console for logs
        </p>
      </div>

      <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Suspense fallback={<Loader />}>
          {selectedModel === 'porsche' && <PorscheModel />}
          {selectedModel === 'toycar' && <ToyCarModel />}
        </Suspense>
        
        <OrbitControls />
        
        {/* Grid helper for reference */}
        <gridHelper args={[10, 10, '#444', '#222']} />
      </Canvas>
    </div>
  )
}
