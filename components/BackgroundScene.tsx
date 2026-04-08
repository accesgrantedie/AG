'use client'

import { Canvas } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'

export default function BackgroundScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight />
        <Particles />
      </Canvas>
    </div>
  )
}

function generatePoints(count = 5000) {
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 2
    positions[i3 + 1] = (Math.random() - 0.5) * 2
    positions[i3 + 2] = (Math.random() - 0.5) * 2
  }

  return positions
}

function Particles() {
  const positions = generatePoints();

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#4ADE80"
        size={0.005}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  )
}