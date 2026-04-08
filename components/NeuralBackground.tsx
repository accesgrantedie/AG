'use client'

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three'

type NodeType = {
  position: THREE.Vector3
  velocity: THREE.Vector3
}

function NeuralNet() {
  const groupRef = useRef<THREE.Group>(null)
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null)

  const leafTexture = useLoader(TextureLoader, '/leaf.svg')

  type NodeType = {
    position: THREE.Vector3
    base: THREE.Vector3
    velocity: THREE.Vector3
    offset: number
  }

  // 🌿 Create nodes with "base position" (important for smooth motion)
  const createNodes = (count: number, spread: number): NodeType[] =>
    Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() ** 0.5 * spread

      const base = new THREE.Vector3(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * (spread / 2),
        Math.sin(angle) * radius
      )

      return {
        position: base.clone(),
        base,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002
        ),
        offset: Math.random() * 100
      }
    })

  const frontNodes = useMemo(() => createNodes(50, 6), [])
  const midNodes = useMemo(() => createNodes(100, 12), [])
  const backNodes = useMemo(() => createNodes(180, 20), [])

  const allNodes = [...frontNodes, ...midNodes, ...backNodes]

  // 🔗 Connections
  const connections = useMemo(() => {
    const lines: number[] = []

    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        const dist = allNodes[i].position.distanceTo(allNodes[j].position)
        if (dist < 1.5) {
          lines.push(
            allNodes[i].position.x,
            allNodes[i].position.y,
            allNodes[i].position.z,
            allNodes[j].position.x,
            allNodes[j].position.y,
            allNodes[j].position.z
          )
        }
      }
    }

    return new Float32Array(lines)
  }, [allNodes])

  // 🎬 Animation (NO mouse — pure organic motion)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    allNodes.forEach((node) => {
      const flow = Math.sin(t * 0.3 + node.offset) * 0.2

      // 🌊 Organic floating (around base position)
      node.position.x = node.base.x + Math.sin(t * 0.5 + node.offset) * 0.3
      node.position.y = node.base.y + Math.cos(t * 0.4 + node.offset) * 0.2
      node.position.z = node.base.z + flow

      // subtle drift
      node.position.add(node.velocity)
    })

    // 🌌 slow cinematic rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.00015
    }

    // ✨ subtle breathing lines
    if (lineMaterialRef.current) {
      lineMaterialRef.current.opacity = 0.12 + Math.sin(t) * 0.05
    }
  })

  const getPositions = (nodes: NodeType[]) =>
    new Float32Array(
      nodes.flatMap((n) => [n.position.x, n.position.y, n.position.z])
    )

  return (
    <group ref={groupRef}>
      {/* 🌿 BACK */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[getPositions(backNodes), 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={leafTexture}
          color="#4ADE80"
          size={0.12}
          transparent
          opacity={0.3}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* 🍀 MID */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[getPositions(midNodes), 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={leafTexture}
          color="#4ADE80"
          size={0.22}
          transparent
          opacity={0.7}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* 🌟 FRONT */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[getPositions(frontNodes), 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={leafTexture}
          color="#4ADE80"
          size={0.35}
          transparent
          opacity={0.9}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* 🔗 CONNECTIONS */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connections, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          color="#4ADE80"
          transparent
          opacity={0.15}
        />
      </lineSegments>
    </group>
  )
}

export default function NeuralBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-90">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        {/* 🌫️ Depth fog */}
        <fog attach="fog" args={['#0B1220', 3, 12]} />
        <NeuralNet />
      </Canvas>
    </div>
  )
}