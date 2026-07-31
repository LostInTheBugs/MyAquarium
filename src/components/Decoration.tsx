import { useMemo } from 'react';
import * as THREE from 'three';

interface DecorationProps {
  modelType: string;
  position: [number, number, number];
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function Decoration({ modelType, position, scale, isSelected, onSelect }: DecorationProps) {
  const color = useMemo(() => {
    switch (modelType) {
      case 'castle': return '#c8b896';
      case 'shipwreck': return '#8b7355';
      case 'chest': return '#8b6914';
      case 'amphora': return '#cc8844';
      case 'root': return '#5c4033';
      case 'statue': return '#d4c8b8';
      case 'tunnel': return '#888888';
      default: return '#999999';
    }
  }, [modelType]);

  const renderContent = () => {
    switch (modelType) {
      case 'castle':
        return (
          <group>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.25, 0.1, 0.25]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {[[-0.08, -0.08], [-0.08, 0.08], [0.08, -0.08], [0.08, 0.08]].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.15, z]}>
                <cylinderGeometry args={[0.03, 0.04, 0.12, 6]} />
                <meshStandardMaterial color={color} roughness={0.6} />
              </mesh>
            ))}
            <mesh position={[0, 0.2, 0]}>
              <coneGeometry args={[0.06, 0.08, 6]} />
              <meshStandardMaterial color="#cc3333" roughness={0.4} />
            </mesh>
          </group>
        );

      case 'shipwreck':
        return (
          <group>
            <mesh position={[0, 0.05, 0]} rotation={[0, 0.2, 0]}>
              <boxGeometry args={[0.3, 0.08, 0.1]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.05, 0.12, 0.08]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.2, 0.05]} rotation={[0.3, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.15, 6]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
          </group>
        );

      case 'chest':
        return (
          <group>
            <mesh position={[0, 0.03, 0]}>
              <boxGeometry args={[0.15, 0.06, 0.1]} />
              <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.06, 0.05]}>
              <boxGeometry args={[0.15, 0.02, 0.02]} />
              <meshStandardMaterial color="#ffcc00" roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        );

      case 'amphora':
        return (
          <group>
            <mesh position={[0, 0.04, 0]}>
              <sphereGeometry args={[0.06, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.02, 0.04, 0.04, 8]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <torusGeometry args={[0.025, 0.008, 8, 12]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
          </group>
        );

      case 'root':
        return (
          <group>
            {Array.from({ length: 5 }, (_, i) => (
              <mesh key={i}
                position={[Math.sin(i * 1.3) * 0.08, 0.04 + Math.random() * 0.1, Math.cos(i * 1.3) * 0.08]}
                rotation={[Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5]}
              >
                <cylinderGeometry args={[0.01, 0.02, 0.1 + Math.random() * 0.2, 6]} />
                <meshStandardMaterial color={color} roughness={0.8} />
              </mesh>
            ))}
          </group>
        );

      case 'statue':
        return (
          <group>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.1, 0.04, 0.1]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.02, 0.04, 0.08, 8]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color={color} roughness={0.3} />
            </mesh>
          </group>
        );

      case 'tunnel':
        return (
          <group>
            <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.08, 0.03, 8, 8, Math.PI]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.12, 0.08, 0.12]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
        );
    }
  };

  return (
    <group
      position={position}
      scale={scale}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {renderContent()}
      {isSelected && (
        <mesh position={[0, 0.1, 0]}>
          <ringGeometry args={[0.2 * scale, 0.21 * scale, 32]} />
          <meshBasicMaterial color="#ffcc00" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
