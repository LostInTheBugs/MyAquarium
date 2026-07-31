import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlantProps {
  modelType: string;
  position: [number, number, number];
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function Plant({ modelType, position, scale, isSelected, onSelect }: PlantProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leafRefs = useRef<THREE.Mesh[]>([]);

  const color = useMemo(() => {
    switch (modelType) {
      case 'plant-tall': return '#2d8a4e';
      case 'plant-broad': return '#1a6b2e';
      case 'plant-fern': return '#3a9a40';
      case 'plant-moss': return '#4a8a30';
      case 'plant-red': return '#aa3333';
      case 'plant-grass': return '#5aaa40';
      default: return '#3a8a30';
    }
  }, [modelType]);

  const numLeaves = modelType === 'plant-grass' ? 8 : modelType === 'plant-moss' ? 12 : modelType === 'plant-broad' ? 5 : 6;

  const leafData = useMemo(() => {
    return Array.from({ length: numLeaves }, (_, i) => ({
      angle: (i / numLeaves) * Math.PI * 2 + Math.random() * 0.5,
      tilt: 0.2 + Math.random() * 0.5,
      height: 0.3 + Math.random() * 0.7,
      width: modelType === 'plant-broad' ? 0.08 + Math.random() * 0.06 : 0.02 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [numLeaves, modelType]);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = Date.now() * 0.002;
    leafRefs.current.forEach((leaf, i) => {
      if (!leaf) return;
      const sway = Math.sin(t * 1.5 + leafData[i].phase) * 0.1;
      leaf.rotation.z = leafData[i].tilt + sway;
      leaf.rotation.x = Math.cos(t * 1.2 + leafData[i].phase) * 0.08;
    });
  });

  return (
    <group ref={groupRef} position={position} scale={scale} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#4a6a30" roughness={0.8} />
      </mesh>

      {/* Leaves */}
      {leafData.map((leaf, i) => (
        <mesh
          key={i}
          ref={(el) => { leafRefs.current[i] = el!; }}
          position={[0, 0.1 + leaf.height * 0.5, 0]}
          rotation={[0, leaf.angle, leaf.tilt]}
        >
          <planeGeometry args={[leaf.width, leaf.height]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {isSelected && (
        <mesh position={[0, 0.2, 0]}>
          <ringGeometry args={[0.5, 0.52, 32]} />
          <meshBasicMaterial color="#ffcc00" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
