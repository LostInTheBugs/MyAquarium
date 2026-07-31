import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TankSize } from '../types';
import { tankDimensions } from '../types';

interface BubbleSystemProps {
  enabled: boolean;
  intensity: 'low' | 'medium' | 'high';
  size: TankSize;
  audioRef?: React.RefObject<{ setPumpState: (on: boolean) => void }>;
}

function BubbleMesh({ pos, speed, size: bSize }: { pos: [number, number, number]; speed: number; size: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const wobblePhase = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!ref.current) return;
    wobblePhase.current += delta * 3;
    ref.current.position.y += speed * delta;
    ref.current.position.x = pos[0] + Math.sin(wobblePhase.current) * 0.03;
    ref.current.position.z = pos[2] + Math.cos(wobblePhase.current * 1.3) * 0.02;
  });

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[bSize, 8, 8]} />
      <meshPhysicalMaterial
        color="#ffffff"
        roughness={0}
        metalness={0}
        transparent
        opacity={0.55}
        envMapIntensity={0.3}
        clearcoat={0.1}
      />
    </mesh>
  );
}

export function BubbleSystem({ enabled, intensity, size }: BubbleSystemProps) {
  const dims = tankDimensions(size);
  const groupRef = useRef<THREE.Group>(null);
  const bubblePhase = useRef(0);

  const bubblesPerSecond = intensity === 'high' ? 15 : intensity === 'medium' ? 8 : 4;
  const [bubbles, setBubbles] = useState<{ id: number; pos: [number, number, number]; speed: number; bSize: number; key: number }[]>([]);
  const nextId = useRef(0);
  const accumulatedTime = useRef(0);

  // Diffuser stone position
  const diffuserPos: [number, number, number] = [0, -dims.height / 2 + 0.25, dims.depth * 0.2];

  useFrame((_, delta) => {
    if (!enabled) {
      // Fade out remaining bubbles
      setBubbles(prev => prev.slice(0, Math.max(0, prev.length - 2)));
      return;
    }

    accumulatedTime.current += delta;
    const interval = 1 / bubblesPerSecond;

    while (accumulatedTime.current >= interval) {
      accumulatedTime.current -= interval;
      const id = nextId.current++;
      setBubbles(prev => {
        if (prev.length > 80) prev = prev.slice(-60);
        return [...prev, {
          id,
          pos: [
            diffuserPos[0] + (Math.random() - 0.5) * 0.08,
            diffuserPos[1],
            diffuserPos[2] + (Math.random() - 0.5) * 0.08,
          ],
          speed: 0.15 + Math.random() * 0.3 * (intensity === 'high' ? 1.5 : 1),
          bSize: 0.008 + Math.random() * 0.025,
          key: id,
        }];
      });
    }

    // Remove bubbles that reached the top
    const maxY = dims.height / 2 - 0.3;
    setBubbles(prev => prev.filter(b => {
      return b.pos[1] < maxY && b.pos[1] > -dims.height / 2;
    }));

    bubblePhase.current += delta;
  });

  return (
    <group ref={groupRef}>
      {/* Diffuser stone */}
      <mesh position={diffuserPos} receiveShadow castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.04, 8]} />
        <meshStandardMaterial color="#aaaacc" roughness={0.8} />
      </mesh>

      {/* Air hose from top to diffuser */}
      <mesh position={[diffuserPos[0], diffuserPos[1] + (dims.height / 2 - 0.4) / 2, diffuserPos[2]]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, dims.height / 2 - 0.4 - diffuserPos[1], 6]} />
        <meshStandardMaterial color="#334455" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Air pump device at top-back */}
      <mesh position={[0, dims.height / 2 - 0.05, -dims.depth / 2 + 0.1]} castShadow>
        <boxGeometry args={[0.15, 0.08, 0.1]} />
        <meshStandardMaterial
          color="#446688"
          roughness={0.3}
          metalness={0.5}
          emissive={enabled ? '#224466' : '#111111'}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Pump indicator light */}
      <mesh position={[0, dims.height / 2 - 0.02, -dims.depth / 2 + 0.16]} castShadow>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial
          color={enabled ? '#00ff66' : '#333333'}
          roughness={0.1}
          emissive={enabled ? '#00ff66' : '#111111'}
          emissiveIntensity={1}
        />
      </mesh>

      {/* Connection: pump to hose top */}
      <mesh position={[0, dims.height / 2 - 0.12, -dims.depth / 2 + 0.12]}>
        <torusGeometry args={[0.03, 0.008, 6, 8]} />
        <meshStandardMaterial color="#334455" roughness={0.3} />
      </mesh>

      {/* Active bubbles */}
      {enabled && bubbles.map(b => (
        <BubbleMesh
          key={b.key}
          pos={[...b.pos] as [number, number, number]}
          speed={b.speed}
          size={b.bSize}
        />
      ))}
    </group>
  );
}
