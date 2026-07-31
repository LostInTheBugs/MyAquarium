import { useMemo } from 'react';
import type { TankSize, WaterType } from '../types';
import { tankDimensions } from '../types';

interface SandFloorProps {
  size: TankSize;
  waterType: WaterType;
  substrateType?: string;
  graphicsQuality?: string;
}

export function SandFloor({ size, waterType, substrateType, graphicsQuality = 'high' }: SandFloorProps) {
  const dims = tankDimensions(size);
  const highQuality = graphicsQuality !== 'low';

  const color = useMemo(() => {
    if (substrateType) {
      switch (substrateType) {
        case 'sand-light': return '#d4bc8c';
        case 'sand-dark': return '#6b5b3a';
        case 'gravel': return '#8a8a7a';
        case 'pebbles': return '#9e9480';
        case 'plant-substrate': return '#4a3020';
        case 'marine-sand': return '#f0e8d0';
        case 'aragonite': return '#f5f0e5';
        case 'crushed-coral': return '#fae8d0';
        default: return waterType === 'marine' ? '#f0e8d0' : '#d4bc8c';
      }
    }
    return waterType === 'marine' ? '#f0e8d0' : '#d4bc8c';
  }, [substrateType, waterType]);

  const pebbles = useMemo(() => {
    const count = size === 'large' ? 50 : size === 'medium' ? 30 : 15;
    return Array.from({ length: count }, () => ({
      pos: [
        (Math.random() - 0.5) * (dims.width - 0.6),
        -dims.height / 2 + 0.13,
        (Math.random() - 0.5) * (dims.depth - 0.6),
      ] as [number, number, number],
      scale: 0.015 + Math.random() * 0.05,
      color: ['#998877', '#887766', '#aa9988', '#bbaa99'][Math.floor(Math.random() * 4)],
    }));
  }, [dims, size]);

  const rocks = useMemo(() => {
    const count = size === 'large' ? 10 : size === 'medium' ? 6 : 3;
    return Array.from({ length: count }, () => ({
      pos: [
        (Math.random() - 0.5) * (dims.width - 1),
        -dims.height / 2 + 0.16,
        (Math.random() - 0.5) * (dims.depth - 1),
      ] as [number, number, number],
      rot: [Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4] as [number, number, number],
      scale: [0.06 + Math.random() * 0.14, 0.03 + Math.random() * 0.06, 0.05 + Math.random() * 0.1] as [number, number, number],
      color: waterType === 'marine' ? ['#aa9988', '#998877', '#bbaa99'][Math.floor(Math.random() * 3)] : ['#888877', '#777766', '#999988'][Math.floor(Math.random() * 3)],
    }));
  }, [dims, size, waterType]);

  return (
    <group>
      {/* Main substrate layer */}
      <mesh position={[0, -dims.height / 2 + 0.06, 0]} receiveShadow>
        <boxGeometry args={[dims.width - 0.15, 0.12, dims.depth - 0.15]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0} />
      </mesh>

      {/* Slightly raised irregular top surface */}
      <mesh position={[0, -dims.height / 2 + 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[dims.width - 0.18, dims.depth - 0.18, 20, 20]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
      </mesh>

      {/* Pebbles */}
      {pebbles.map((p, i) => (
        <mesh key={`peb-${i}`} position={p.pos} scale={p.scale} receiveShadow castShadow={highQuality}>
          <sphereGeometry args={[1, 5, 4]} />
          <meshStandardMaterial color={p.color} roughness={0.7} />
        </mesh>
      ))}

      {/* Larger rocks */}
      {highQuality && rocks.map((r, i) => (
        <mesh key={`rock-${i}`} position={r.pos} rotation={r.rot} scale={r.scale} receiveShadow castShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={r.color} roughness={0.55} />
        </mesh>
      ))}

      {/* Subtle color variation patches (marine: crushed coral bits) */}
      {highQuality && waterType === 'marine' && Array.from({ length: 8 }, (_, i) => {
        const px = (Math.random() - 0.5) * (dims.width - 0.8);
        const pz = (Math.random() - 0.5) * (dims.depth - 0.8);
        return (
          <mesh key={`coral-bit-${i}`} position={[px, -dims.height / 2 + 0.14, pz]} scale={0.02 + Math.random() * 0.04}>
            <sphereGeometry args={[1, 4, 3]} />
            <meshStandardMaterial color="#ffe8d0" roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}
