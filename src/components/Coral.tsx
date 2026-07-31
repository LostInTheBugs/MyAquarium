import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoralProps {
  modelType: string;
  position: [number, number, number];
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function Coral({ modelType, position, scale, isSelected, onSelect }: CoralProps) {
  const groupRef = useRef<THREE.Group>(null);

  const color = useMemo(() => {
    switch (modelType) {
      case 'coral-brain': return '#cc8844';
      case 'coral-branch': return '#ee6644';
      case 'coral-colorful': return '#ff44aa';
      case 'anemone': return '#ff66aa';
      case 'starfish': return '#ff8844';
      case 'urchin': return '#333344';
      case 'crab': return '#cc4422';
      case 'shrimp': return '#ff6644';
      default: return '#ee7755';
    }
  }, [modelType]);

  const branches = useMemo(() => {
    if (modelType === 'starfish') return [];
    if (modelType === 'urchin') return [];
    if (modelType === 'crab') return [];
    if (modelType === 'shrimp') return [];
    if (modelType === 'anemone') {
      return Array.from({ length: 12 }, (_, i) => ({
        angle: (i / 12) * Math.PI * 2,
        tilt: 0.2 + Math.random() * 0.5,
        height: 0.15 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
      }));
    }
    const count = modelType === 'coral-brain' ? 20 : modelType === 'coral-branch' ? 8 : 12;
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + Math.random() * 0.3,
      tilt: 0.1 + Math.random() * 0.6,
      height: 0.1 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [modelType]);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = Date.now() * 0.001;
    if (modelType === 'anemone') {
      groupRef.current.children.forEach((child, i) => {
        if (child.name.startsWith('tentacle')) {
          child.scale.y = 1 + Math.sin(t * 3 + i * 0.5) * 0.3;
        }
      });
    }
  });

  if (modelType === 'starfish') {
    return (
      <group ref={groupRef} position={position} scale={scale} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.02, 0.05, 5]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        {isSelected && (
          <mesh position={[0, 0.02, 0]}>
            <ringGeometry args={[0.18, 0.19, 32]} />
            <meshBasicMaterial color="#ffcc00" side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    );
  }

  if (modelType === 'urchin') {
    return (
      <group ref={groupRef} position={position} scale={scale} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#222233" roughness={0.3} />
        </mesh>
        {Array.from({ length: 20 }, (_, i) => (
          <mesh key={i}
            position={[
              Math.sin(i * 0.8) * 0.13,
              Math.cos(i * 1.3) * 0.13,
              Math.sin(i * 0.6) * 0.13,
            ]}
            rotation={[Math.sin(i) * 0.5, i * 0.4, Math.cos(i) * 0.3]}
          >
            <cylinderGeometry args={[0.005, 0.003, 0.08, 6]} />
            <meshStandardMaterial color="#5533aa" roughness={0.5} />
          </mesh>
        ))}
        {isSelected && (
          <mesh>
            <ringGeometry args={[0.2, 0.21, 32]} />
            <meshBasicMaterial color="#ffcc00" side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    );
  }

  if (modelType === 'crab') {
    return (
      <group ref={groupRef} position={position} scale={scale} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.14, 0.06, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        {[[1, 0.07], [-1, -0.07]].map(([, xOff], i) => (
          <group key={i} position={[xOff, 0.02, 0]}>
            <mesh>
              <cylinderGeometry args={[0.015, 0.02, 0.12, 8]} />
              <meshStandardMaterial color={color} roughness={0.4} />
            </mesh>
          </group>
        ))}
        {isSelected && (
          <mesh position={[0, 0.04, 0]}>
            <ringGeometry args={[0.15, 0.16, 32]} />
            <meshBasicMaterial color="#ffcc00" side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    );
  }

  return (
    <group ref={groupRef} position={position} scale={scale} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Base */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.1, 8]} />
        <meshStandardMaterial color="#cc9966" roughness={0.7} />
      </mesh>

      {/* Branches/tentacles */}
      {branches.map((b, i) => (
        <mesh
          key={i}
          name={modelType === 'anemone' ? 'tentacle' : `branch-${i}`}
          position={[
            Math.sin(b.angle) * 0.06,
            b.height * 0.4,
            Math.cos(b.angle) * 0.06,
          ]}
          rotation={[b.tilt, b.angle, 0]}
        >
          <cylinderGeometry args={[0.015, 0.025, b.height, 6]} />
          <meshStandardMaterial
            color={modelType === 'anemone' ? '#ff88bb' : color}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      ))}

      {isSelected && (
        <mesh position={[0, 0.05, 0]}>
          <ringGeometry args={[0.2, 0.21, 32]} />
          <meshBasicMaterial color="#ffcc00" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
