import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TankSize } from '../types';
import { tankDimensions } from '../types';

interface BubbleSystemProps {
  enabled: boolean;
  intensity: 'low' | 'medium' | 'high';
  size: TankSize;
  quality?: string;
}

function BubbleMesh({ pos, speed, bSize, quality }: { pos: [number, number, number]; speed: number; bSize: number; quality: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!ref.current) return;
    phase.current += delta * 2.5;
    ref.current.position.y += speed * delta;
    ref.current.position.x = pos[0] + Math.sin(phase.current) * 0.04;
    ref.current.position.z = pos[2] + Math.cos(phase.current * 1.2) * 0.03;
  });

  const highQ = quality === 'high';

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[bSize, highQ ? 12 : 8, highQ ? 12 : 8]} />
      <meshPhysicalMaterial
        color="#ffffff"
        roughness={0}
        metalness={0}
        transparent
        opacity={0.5}
        envMapIntensity={highQ ? 0.15 : 0.05}
        clearcoat={highQ ? 0.2 : 0}
      />
    </mesh>
  );
}

export function BubbleSystem({ enabled, intensity, size, quality = 'high' }: BubbleSystemProps) {
  const dims = tankDimensions(size);
  const [bubbles, setBubbles] = useState<{ id: number; pos: [number, number, number]; speed: number; bSize: number; key: number }[]>([]);
  const nextId = useRef(0);
  const accTime = useRef(0);

  const bps = intensity === 'high' ? 14 : intensity === 'medium' ? 8 : 4;
  const diffuserPos: [number, number, number] = [dims.width * 0.15, -dims.height / 2 + 0.25, dims.depth * 0.15];

  useFrame((_, delta) => {
    if (!enabled) { setBubbles(prev => prev.slice(0, Math.max(0, prev.length - 3))); return; }
    accTime.current += delta;
    const interval = 1 / bps;
    while (accTime.current >= interval) {
      accTime.current -= interval;
      const id = nextId.current++;
      setBubbles(prev => {
        const kept = prev.length > 100 ? prev.slice(-70) : prev;
        return [...kept, {
          id, pos: [diffuserPos[0] + (Math.random() - 0.5) * 0.1, diffuserPos[1], diffuserPos[2] + (Math.random() - 0.5) * 0.1],
          speed: 0.12 + Math.random() * 0.25 * (intensity === 'high' ? 1.4 : 1),
          bSize: 0.006 + Math.random() * 0.022 * (quality === 'high' ? 1 : 0.7),
          key: id,
        }];
      });
    }
    setBubbles(prev => prev.filter(b => b.pos[1] < dims.height / 2 - 0.3));
  });

  return (
    <group>
      {/* Diffuser stone */}
      <mesh position={diffuserPos} receiveShadow castShadow>
        <cylinderGeometry args={[0.045, 0.055, 0.04, 8]} />
        <meshStandardMaterial color="#9999aa" roughness={0.85} />
      </mesh>

      {/* Air hose */}
      <mesh position={[diffuserPos[0], (dims.height / 2 - 0.5 + diffuserPos[1]) / 2, diffuserPos[2]]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, dims.height / 2 - 0.5 - diffuserPos[1], 6]} />
        <meshStandardMaterial color="#334455" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Pump unit at top-back */}
      <mesh position={[dims.width * 0.2, dims.height / 2 - 0.04, -dims.depth / 2 + 0.08]} castShadow>
        <boxGeometry args={[0.14, 0.07, 0.09]} />
        <meshStandardMaterial color="#3a5a7a" roughness={0.25} metalness={0.55} emissive={enabled ? '#112233' : '#050505'} emissiveIntensity={0.3} />
      </mesh>
      {/* Status LED */}
      <mesh position={[dims.width * 0.2, dims.height / 2 + 0.01, -dims.depth / 2 + 0.13]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color={enabled ? '#00ff55' : '#222222'} roughness={0.1} emissive={enabled ? '#00ff55' : '#050505'} emissiveIntensity={1.2} />
      </mesh>

      {/* Hose connection ring */}
      <mesh position={[dims.width * 0.2, dims.height / 2 - 0.1, -dims.depth / 2 + 0.1]}>
        <torusGeometry args={[0.025, 0.007, 6, 8]} />
        <meshStandardMaterial color="#334455" roughness={0.3} />
      </mesh>

      {/* Bubbles */}
      {enabled && bubbles.map(b => (
        <BubbleMesh key={b.key} pos={[...b.pos] as [number, number, number]} speed={b.speed} bSize={b.bSize} quality={quality} />
      ))}
    </group>
  );
}
