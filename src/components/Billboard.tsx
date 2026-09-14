import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BillboardProps {
  texture: THREE.Texture | null;
  /** Taille du plan en unités monde (largeur x hauteur). */
  width: number;
  height: number;
  /** Nombre de plans croisés (1 = simple face, 2-3 = volume). */
  planes?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  /** Orientation du plan principal : 'vertical' (par défaut) ou 'horizontal'. */
  orientation?: 'vertical' | 'horizontal';
  opacity?: number;
  onSelect?: () => void;
  selected?: boolean;
  /** Animation de pulsation douce (anémones, coraux mous). */
  pulse?: number;
  /** Léger balancement (plantes). */
  sway?: number;
  seed?: number;
}

/**
 * Billboards croisés texturés (sprites RGBA) — remplace la géométrie
 * procédurale unicolore par des rendus photoréalistes.
 */
export function Billboard({
  texture, width, height, planes = 2, position = [0, 0, 0],
  rotation = [0, 0, 0], orientation = 'vertical', opacity = 1,
  onSelect, selected, pulse = 0, sway = 0, seed = 0,
}: BillboardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const phase = useMemo(() => seed * 7.13, [seed]);

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    const t = clock.elapsedTime;
    if (sway > 0) {
      g.rotation.z = Math.sin(t * 1.1 + phase) * sway;
      g.rotation.x = Math.cos(t * 0.8 + phase) * sway * 0.6;
    }
    if (pulse > 0) {
      const s = 1 + Math.sin(t * 2.2 + phase) * pulse;
      g.scale.set(s, 1 / Math.sqrt(s), s);
    }
  });

  const material = useMemo(() => (
    <meshStandardMaterial
      map={texture ?? undefined}
      transparent
      opacity={opacity}
      alphaTest={0.08}
      side={THREE.DoubleSide}
      depthWrite={false}
      roughness={0.55}
    />
  ), [texture, opacity]);

  const baseRotation: [number, number, number] = orientation === 'horizontal'
    ? [-Math.PI / 2, 0, 0]
    : [0, 0, 0];

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {Array.from({ length: planes }, (_, i) => {
        const angle = orientation === 'horizontal'
          ? [0, (i / planes) * Math.PI, 0]
          : [0, (i / planes) * Math.PI, 0];
        return (
          <mesh
            key={i}
            rotation={[baseRotation[0] + angle[0], baseRotation[1] + angle[1], baseRotation[2] + angle[2]]}
            onClick={(e) => { if (onSelect) { e.stopPropagation(); onSelect(); } }}
          >
            <planeGeometry args={[width, height]} />
            {material}
          </mesh>
        );
      })}
      {selected && (
        <mesh position={[0, height * 0.15, 0]}>
          <ringGeometry args={[Math.max(width, height) * 0.55, Math.max(width, height) * 0.56, 32]} />
          <meshBasicMaterial color="#ffcc00" side={THREE.DoubleSide} transparent opacity={0.6} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
