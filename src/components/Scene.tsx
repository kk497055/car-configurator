'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import CarModel from './CarModel'

function LoadingFallback() {
  // Empty fallback - no visible loading placeholder
  return null
}

export function Scene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        shadows
        camera={{ position: [5, 3, 5], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* Light whitish-grey background for professional look */}
        <color attach="background" args={['#e8e8ec']} />
        
        {/* Enhanced lighting for showroom feel */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 15, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-10, 8, -5]} intensity={0.7} />
        <spotLight 
          position={[0, 15, 0]} 
          intensity={0.8} 
          angle={0.6} 
          penumbra={1}
        />
        {/* Rim light for car edges */}
        <directionalLight position={[0, 5, -10]} intensity={0.4} />
        
        <Suspense fallback={<LoadingFallback />}>
          <CarModel />
          <ContactShadows 
            position={[0, -1, 0]} 
            opacity={0.4} 
            scale={15} 
            blur={2.5} 
            far={6}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={4}
          maxDistance={20}
          enablePan={false}
        />
      </Canvas>
    </div>
  )
}

export default Scene
