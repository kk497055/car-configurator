'use client'

import { useRef, useEffect } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { Decal, useTexture, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

// Use the Porsche 911 model for realistic car display
const MODEL_PATH = '/models/1992_porsche_911_964_turbo_s_3.6.glb'
const MODEL_SCALE = 120 // Porsche model needs large scale (units are small)

// Individual Decal component that loads its own texture
function CarDecal({ 
  position, 
  rotation, 
  scale, 
  textureUrl 
}: { 
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  textureUrl: string 
}) {
  const texture = useTexture(textureUrl)
  
  return (
    <Decal
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <meshStandardMaterial
        map={texture}
        transparent
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </Decal>
  )
}

export function CarModel() {
  const { scene } = useGLTF(MODEL_PATH)
  const modelRef = useRef<THREE.Group>(null)
  
  const { 
    bodyColor, 
    decalMode, 
    selectedDecalTexture, 
    addDecal, 
    decals,
    decalScale,
    decalRotation
  } = useStore()

  // Update materials when body color changes
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshStandardMaterial
          if (material.color) {
            material.color.set(bodyColor)
          }
        }
      })
    }
  }, [scene, bodyColor])

  // Handle click on car mesh for decal placement
  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (!decalMode || !selectedDecalTexture) return
    
    event.stopPropagation()
    
    const { point, face } = event
    
    if (!face) return
    
    const normal = face.normal.clone()
    
    if (event.object.matrixWorld) {
      normal.transformDirection(event.object.matrixWorld)
    }
    
    const euler = new THREE.Euler()
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    euler.setFromQuaternion(quaternion)
    
    // Apply user-defined rotation (convert degrees to radians and add to z-axis)
    const userRotationRad = (decalRotation * Math.PI) / 180
    euler.z += userRotationRad
    
    addDecal({
      position: [point.x, point.y, point.z],
      rotation: [euler.x, euler.y, euler.z],
      scale: [decalScale, decalScale, decalScale],
      textureUrl: selectedDecalTexture,
    })
  }

  return (
    <group ref={modelRef}>
      <primitive 
        object={scene} 
        scale={MODEL_SCALE}
        position={[0, -1, 0]}
        rotation={[0, Math.PI / 4, 0]}
        onPointerUp={handlePointerUp}
      />
      {decals.map((decal) => (
        <mesh
          key={decal.id}
          position={decal.position}
          rotation={decal.rotation}
        >
          <planeGeometry args={[decal.scale[0], decal.scale[1]]} />
          <DecalMaterial textureUrl={decal.textureUrl} />
        </mesh>
      ))}
    </group>
  )
}

function DecalMaterial({ textureUrl }: { textureUrl: string }) {
  const texture = useTexture(textureUrl)
  
  return (
    <meshStandardMaterial
      map={texture}
      transparent
      side={THREE.DoubleSide}
      depthWrite={false}
      polygonOffset
      polygonOffsetFactor={-1}
    />
  )
}

export default CarModel
