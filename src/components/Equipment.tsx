import { useMemo } from 'react';
import * as THREE from 'three';

interface EquipmentProps {
  modelType: string;
  position: [number, number, number];
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  pumpActive?: boolean;
}

export function Equipment({ modelType, position, scale, isSelected, onSelect, pumpActive }: EquipmentProps) {
  const color = useMemo(() => {
    switch (modelType) {
      case 'air-pump': return '#4488aa';
      case 'filter': return '#555555';
      case 'heater': return '#aa4444';
      case 'thermometer': return '#44aa44';
      case 'led-light': return '#ffee88';
      case 'skimmer': return '#448888';
      default: return '#666666';
    }
  }, [modelType]);

  const renderContent = () => {
    switch (modelType) {
      case 'air-pump':
        return (
          <group>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.12, 0.08, 0.08]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
            </mesh>
            <mesh position={[0, -0.03, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
              <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.6} />
            </mesh>
            {pumpActive && (
              <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshStandardMaterial color="#00ff88" roughness={0.2} emissive="#00ff88" emissiveIntensity={0.5} />
              </mesh>
            )}
          </group>
        );

      case 'filter':
        return (
          <group>
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.08, 0.12, 0.06]} />
              <meshStandardMaterial color={color} roughness={0.4} metalness={0.5} />
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <cylinderGeometry args={[0.02, 0.03, 0.06, 8]} />
              <meshStandardMaterial color="#777777" roughness={0.4} />
            </mesh>
          </group>
        );

      case 'heater':
        return (
          <group>
            <mesh>
              <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh position={[0, 0.11, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
              <meshStandardMaterial color="#444444" roughness={0.3} />
            </mesh>
          </group>
        );

      case 'thermometer':
        return (
          <group>
            <mesh>
              <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
              <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.3} />
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#ff4444" roughness={0.2} />
            </mesh>
          </group>
        );

      case 'led-light':
        return (
          <group>
            <mesh position={[0, 0.03, 0]}>
              <boxGeometry args={[0.3, 0.04, 0.06]} />
              <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.01, 0.03]}>
              <planeGeometry args={[0.28, 0.02]} />
              <meshStandardMaterial color={color} roughness={0.1} emissive={color} emissiveIntensity={0.8} />
            </mesh>
          </group>
        );

      case 'skimmer':
        return (
          <group>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.12, 8]} />
              <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.02, 0.04, 0.03, 8]} />
              <meshStandardMaterial color={color} roughness={0.3} />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color={color} roughness={0.5} />
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
        <mesh position={[0, 0.06, 0]}>
          <ringGeometry args={[0.18, 0.19, 32]} />
          <meshBasicMaterial color="#ffcc00" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
