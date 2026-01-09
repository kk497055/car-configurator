'use client'

import { useRef } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { Decal, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

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

// Dummy car made from primitive shapes
export function CarMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  
  const { 
    bodyColor, 
    decalMode, 
    selectedDecalTexture, 
    addDecal, 
    decals 
  } = useStore()

  // Handle click on car mesh for decal placement
  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (!decalMode || !selectedDecalTexture) return
    
    event.stopPropagation()
    
    const { point, face } = event
    
    if (!face) return
    
    // Calculate rotation from face normal
    const normal = face.normal.clone()
    
    // Transform normal to world space if needed
    if (event.object.matrixWorld) {
      normal.transformDirection(event.object.matrixWorld)
    }
    
    // Calculate euler rotation from normal
    const euler = new THREE.Euler()
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    euler.setFromQuaternion(quaternion)
    
    addDecal({
      position: [point.x, point.y, point.z],
      rotation: [euler.x, euler.y, euler.z],
      scale: [0.5, 0.5, 0.5],
      textureUrl: selectedDecalTexture,
    })
  }

  return (
    <group>
      {/* Main car body - elongated box */}
      <mesh
        ref={bodyRef}
        position={[0, 0.5, 0]}
        onPointerUp={handlePointerUp}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[4, 1, 1.8]} />
        <meshStandardMaterial 
          color={bodyColor} 
          metalness={0.6} 
          roughness={0.4}
        />
        {/* Render decals on the main body */}
        {decals.map((decal) => (
          <CarDecal
            key={decal.id}
            position={decal.position}
            rotation={decal.rotation}
            scale={decal.scale}
            textureUrl={decal.textureUrl}
          />
        ))}
      </mesh>

      {/* Car roof/cabin */}
      <mesh
        position={[0.3, 1.2, 0]}
        onPointerUp={handlePointerUp}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 0.8, 1.6]} />
        <meshStandardMaterial 
          color={bodyColor} 
          metalness={0.6} 
          roughness={0.4}
        />
      </mesh>

      {/* Front hood slope */}
      <mesh
        position={[-1.3, 0.8, 0]}
        rotation={[0, 0, -0.3]}
        onPointerUp={handlePointerUp}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 0.3, 1.7]} />
        <meshStandardMaterial 
          color={bodyColor} 
          metalness={0.6} 
          roughness={0.4}
        />
      </mesh>

      {/* Rear trunk slope */}
      <mesh
        position={[1.5, 0.8, 0]}
        rotation={[0, 0, 0.4]}
        onPointerUp={handlePointerUp}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.8, 0.3, 1.7]} />
        <meshStandardMaterial 
          color={bodyColor} 
          metalness={0.6} 
          roughness={0.4}
        />
      </mesh>

      {/* Windows - darker glass material */}
      <mesh position={[0.3, 1.2, 0.81]}>
        <boxGeometry args={[1.8, 0.6, 0.02]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh position={[0.3, 1.2, -0.81]}>
        <boxGeometry args={[1.8, 0.6, 0.02]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Front windshield */}
      <mesh position={[-0.65, 1.1, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.7, 0.02, 1.5]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Rear windshield */}
      <mesh position={[1.2, 1.1, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.6, 0.02, 1.5]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Wheels */}
      <Wheel position={[-1.2, 0.1, 1]} />
      <Wheel position={[-1.2, 0.1, -1]} />
      <Wheel position={[1.2, 0.1, 1]} />
      <Wheel position={[1.2, 0.1, -1]} />

      {/* Headlights */}
      <mesh position={[-2, 0.5, 0.6]}>
        <boxGeometry args={[0.05, 0.2, 0.3]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffff99" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-2, 0.5, -0.6]}>
        <boxGeometry args={[0.05, 0.2, 0.3]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffff99" emissiveIntensity={0.5} />
      </mesh>

      {/* Taillights */}
      <mesh position={[2, 0.5, 0.6]}>
        <boxGeometry args={[0.05, 0.2, 0.3]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[2, 0.5, -0.6]}>
        <boxGeometry args={[0.05, 0.2, 0.3]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

// Wheel component
function Wheel({ position }: { position: [number, number, number] }) {
  const wheelRef = useRef<THREE.Mesh>(null)
  
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.32, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default CarMesh
