import { useMemo } from 'react';
import * as THREE from 'three';
import type { TankSize } from '../types';
import { tankDimensions, standHeight, STAND_GAP } from '../types';

/**
 * Meuble noir mat sous le bac (référence : meubles d'aquarium modernes —
 * caisson minimaliste sans poignées). Donne au bac une assise physique
 * au lieu de « flotter » dans le vide.
 */
export function TankStand({ size }: { size: TankSize }) {
  const dims = tankDimensions(size);
  const w = dims.width + 0.5;
  const d = dims.depth + 0.5;
  const h = standHeight(size);
  const topY = -dims.height / 2 - STAND_GAP; // le bac repose dessus
  const cy = topY - h / 2;

  const bodyColor = useMemo(() => new THREE.Color('#0b0c0e'), []);

  return (
    <group>
      {/* Corps du meuble */}
      <mesh position={[0, cy, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.08} />
      </mesh>
      {/* Plateau supérieur : léger dépassement, accroche la lumière */}
      <mesh position={[0, topY - 0.02, 0]} castShadow>
        <boxGeometry args={[w + 0.06, 0.04, d + 0.06]} />
        <meshStandardMaterial color="#101216" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Plinthe en retrait */}
      <mesh position={[0, topY - h + 0.025, 0]}>
        <boxGeometry args={[w - 0.14, 0.05, d - 0.14]} />
        <meshStandardMaterial color="#060709" roughness={0.7} />
      </mesh>
      {/* Joint central discret (deux portes) */}
      <mesh position={[0, cy + 0.01, d / 2 + 0.002]}>
        <boxGeometry args={[0.014, h * 0.78, 0.004]} />
        <meshStandardMaterial color="#050607" roughness={0.55} />
      </mesh>
    </group>
  );
}
