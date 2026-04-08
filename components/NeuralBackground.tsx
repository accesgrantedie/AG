'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'

function NeuralNet() {
  const groupRef = useRef<THREE.Group>(null)

  const nodes = useMemo(() => {
    return Array.from({ length: 70 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        0
      )
    }))
  }, [])

  const connections = useMemo(() => {
    const lines: number[] = []

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position)
        if (dist < 0.6) {
          lines.push(
            nodes[i].position.x,
            nodes[i].position.y,
            nodes[i].position.z,
            nodes[j].position.x,
            nodes[j].position.y,
            nodes[j].position.z
          )
        }
      }
    }

    return new Float32Array(lines)
  }, [nodes])

  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null)

  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    nodes.forEach((node) => {
      node.position.x += node.velocity.x + mouse.current.x * 0.002
      node.position.y += node.velocity.y + mouse.current.y * 0.002

      if (Math.abs(node.position.x) > 2) node.velocity.x *= -1
      if (Math.abs(node.position.y) > 1) node.velocity.y *= -1
    })

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005
    }

    if (lineMaterialRef.current) {
      lineMaterialRef.current.opacity = 0.05 + Math.sin(t) * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(nodes.flatMap(n => [
                n.position.x,
                n.position.y,
                n.position.z
              ])),
              3
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#4ADE80"
          size={0.04}
          transparent
          opacity={0.9}
        />
      </points>

      {/* Connections */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[connections, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          color="#4ADE80"
          transparent
          opacity={0.2}
        />
      </lineSegments>
    </group>
  )
}

export default function NeuralBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-70">
      <Canvas camera={{ position: [0, 0, 2.2], fov: 75 }}>
        <NeuralNet />
      </Canvas>
    </div>
  )
}