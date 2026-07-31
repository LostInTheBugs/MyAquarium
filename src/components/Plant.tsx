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
  const stemRefs = useRef<THREE.Mesh[]>([]);

  const config = useMemo(() => {
    switch (modelType) {
      case 'plant-tall': return { color: '#2d8a4e', stems: 4, leafW: 0.025, leafH: 0.3, leafCount: 8 };
      case 'plant-broad': return { color: '#1a6b2e', stems: 2, leafW: 0.06, leafH: 0.35, leafCount: 5 };
      case 'plant-fern': return { color: '#3a9a40', stems: 3, leafW: 0.02, leafH: 0.25, leafCount: 10 };
      case 'plant-moss': return { color: '#4a8a30', stems: 1, leafW: 0.015, leafH: 0.12, leafCount: 16 };
      case 'plant-red': return { color: '#aa3333', stems: 3, leafW: 0.03, leafH: 0.28, leafCount: 7 };
      case 'plant-grass': return { color: '#5aaa40', stems: 6, leafW: 0.012, leafH: 0.2, leafCount: 12 };
      default: return { color: '#3a8a30', stems: 3, leafW: 0.025, leafH: 0.25, leafCount: 8 };
    }
  }, [modelType]);

  const stems = useMemo(() => {
    return Array.from({ length: config.stems }, (_, i) => ({
      angle: (i / config.stems) * Math.PI * 2 + Math.random() * 0.4,
      tilt: 0.1 + Math.random() * 0.3,
      height: 0.25 + Math.random() * 0.5,
      thickness: 0.015 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [config.stems]);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = Date.now() * 0.0015;
    stemRefs.current.forEach((stem, i) => {
      if (!stem || !stems[i]) return;
      const sway = Math.sin(t * 1.2 + stems[i].phase) * 0.08;
      stem.rotation.z = stems[i].tilt + sway;
      stem.rotation.x = Math.cos(t * 0.9 + stems[i].phase) * 0.06;
    });
  });

  return (
    <group ref={groupRef} position={position} scale={scale} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {stems.map((stem, i) => (
        <group key={i}>
          {/* Stem */}
          <mesh
            ref={(el) => { stemRefs.current[i] = el!; }}
            position={[
              Math.sin(stem.angle) * 0.03,
              stem.height * 0.3,
              Math.cos(stem.angle) * 0.03,
            ]}
          >
            <cylinderGeometry args={[stem.thickness * 0.7, stem.thickness, stem.height, 6]} />
            <meshStandardMaterial color="#3a5a28" roughness={0.7} />
          </mesh>
          {/* Leaves along stem */}
          {Array.from({ length: 4 }, (_, li) => {
            const leafY = 0.1 + li * (stem.height / 5);
            const leafAngle = li * 1.5 + stem.phase;
            return (
              <mesh
                key={`leaf-${li}`}
                position={[
                  Math.sin(stem.angle) * 0.03 + Math.cos(leafAngle) * 0.04,
                  leafY,
                  Math.cos(stem.angle) * 0.03 + Math.sin(leafAngle) * 0.04,
                ]}
                rotation={[0, leafAngle, 0.3]}
              >
                <planeGeometry args={[config.leafW, config.leafH * 0.3]} />
                <meshStandardMaterial color={config.color} roughness={0.5} side={THREE.DoubleSide} transparent opacity={0.85} />
              </mesh>
            );
          })}
        </group>
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
