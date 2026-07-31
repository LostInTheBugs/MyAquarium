import { useMemo } from 'react';
import type { TankSize, WaterType } from '../types';
import { tankDimensions } from '../types';

interface SandFloorProps {
  size: TankSize;
  waterType: WaterType;
  substrateType?: string;
}

export function SandFloor({ size, waterType, substrateType }: SandFloorProps) {
  const dims = tankDimensions(size);

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
        default:
          return waterType === 'marine' ? '#f0e8d0' : '#d4bc8c';
      }
    }
    return waterType === 'marine' ? '#f0e8d0' : '#d4bc8c';
  }, [substrateType, waterType]);

  // Generate pebbles
  const pebbles = useMemo(() => {
    const rocks: { pos: [number, number, number]; scale: number; color: string }[] = [];
    const count = size === 'large' ? 40 : size === 'medium' ? 25 : 12;
    const rockColors = ['#888877', '#999988', '#777766', '#aaaa99', '#8a8a7a', '#999988', '#9e9480'];
    for (let i = 0; i < count; i++) {
      rocks.push({
        pos: [
          (Math.random() - 0.5) * (dims.width - 0.6),
          -dims.height / 2 + 0.12,
          (Math.random() - 0.5) * (dims.depth - 0.6),
        ],
        scale: 0.02 + Math.random() * 0.06,
        color: rockColors[Math.floor(Math.random() * rockColors.length)],
      });
    }
    return rocks;
  }, [dims, size]);

  return (
    <group>
      {/* Main substrate layer (thick box for depth) */}
      <mesh position={[0, -dims.height / 2 + 0.06, 0]} receiveShadow>
        <boxGeometry args={[dims.width - 0.15, 0.12, dims.depth - 0.15]} />
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* Slightly displaced top layer for irregularity */}
      <mesh position={[0, -dims.height / 2 + 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[dims.width - 0.18, dims.depth - 0.18, 16, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Small pebbles scattered on surface */}
      {pebbles.map((p, i) => (
        <mesh key={`pebble-${i}`} position={p.pos} scale={p.scale} receiveShadow castShadow>
          <sphereGeometry args={[1, 5, 4]} />
          <meshStandardMaterial color={p.color} roughness={0.7} />
        </mesh>
      ))}

      {/* A few larger rocks */}
      {Array.from({ length: Math.floor(pebbles.length / 5) }, (_, i) => {
        const rx = (Math.random() - 0.5) * (dims.width - 1);
        const rz = (Math.random() - 0.5) * (dims.depth - 1);
        return (
          <mesh
            key={`rock-${i}`}
            position={[rx, -dims.height / 2 + 0.18, rz]}
            rotation={[Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5]}
            scale={[0.08 + Math.random() * 0.1, 0.04 + Math.random() * 0.06, 0.06 + Math.random() * 0.08]}
            receiveShadow castShadow
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={waterType === 'marine' ? ['#aa9988', '#998877', '#bbaa99'][i % 3] : ['#888877', '#777766', '#999988'][i % 3]}
              roughness={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}
