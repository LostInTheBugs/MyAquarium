import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { TankSize } from '../types';
import { tankDimensions } from '../types';
import { useTextureSafe, FISH_SPRITES } from './textures';

interface FishProps {
  modelType: string;
  position: [number, number, number];
  scale: number;
  instanceId: string;
  tankSize: TankSize;
  isSelected: boolean;
  onSelect: () => void;
}

// ─── Sprites de poissons : taille + vitesse par espèce ───
// La largeur du billboard est dérivée du ratio réel du sprite (pas de déformation).

interface FishSpecies {
  size: number;
  speed: number;
}

const speciesMap: Record<string, FishSpecies> = {
  'fish-neon': { size: 0.18, speed: 0.6 },
  'fish-guppy': { size: 0.2, speed: 0.5 },
  'fish-angelfish': { size: 0.35, speed: 0.3 },
  'fish-betta': { size: 0.28, speed: 0.25 },
  'fish-molly': { size: 0.22, speed: 0.5 },
  'fish-cory': { size: 0.16, speed: 0.7 },
  'fish-gold': { size: 0.3, speed: 0.35 },
  'fish-clown': { size: 0.22, speed: 0.45 },
  'fish-tang': { size: 0.3, speed: 0.5 },
  'fish-butterfly': { size: 0.26, speed: 0.4 },
  'fish-goby': { size: 0.15, speed: 0.5 },
  'fish-damsel': { size: 0.16, speed: 0.65 },
};
const defaultSpecies: FishSpecies = { size: 0.2, speed: 0.5 };

// ─── Poissons sprite (billboard orienté, flip selon la direction) ───

export function Fish({ modelType, position: initialPos, tankSize, scale, isSelected, onSelect }: FishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dims = tankDimensions(tankSize);
  const camera = useThree(s => s.camera);
  const rightVec = useMemo(() => new THREE.Vector3(), []);
  const dirVec = useMemo(() => new THREE.Vector3(), []);

  const species = useMemo(() => speciesMap[modelType] || defaultSpecies, [modelType]);
  const url = FISH_SPRITES[modelType] || FISH_SPRITES['fish-neon'];
  const tex = useTextureSafe(url);
  const speed = useMemo(() => species.speed * (0.8 + Math.random() * 0.4), [species.speed]);
  const angle = useRef(Math.random() * Math.PI * 2);
  const swimPhase = useRef(Math.random() * Math.PI * 2);
  const targetY = useRef(initialPos[1]);
  const idleTimer = useRef(Math.random() * 5);

  const s = scale * species.size * 3;
  const w = useMemo(() => {
    const img = tex?.image as HTMLImageElement | undefined;
    const ratio = img && img.width ? img.width / img.height : 2.2;
    return s * ratio;
  }, [s, tex]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const halfW = dims.width / 2 - 0.8;
    const halfH = dims.height / 2 - 0.8;
    const halfD = dims.depth / 2 - 0.8;

    // Comportement d'arrêt occasionnel
    idleTimer.current -= delta;
    const isIdle = idleTimer.current < 0;
    if (isIdle && Math.random() < 0.01) idleTimer.current = 2 + Math.random() * 8;

    const activeSpeed = isIdle ? speed * 0.05 : speed;
    angle.current += delta * activeSpeed * 0.8;
    swimPhase.current += delta * (isIdle ? 2 : 9);

    // Changements de direction doux
    angle.current += Math.sin(Date.now() * 0.0004 + parseFloat(groupRef.current.uuid.slice(0, 4))) * 0.008;

    // Bobbing vertical
    targetY.current += Math.sin(Date.now() * 0.0006 + swimPhase.current) * 0.004;
    targetY.current = Math.max(-halfH + 0.3, Math.min(halfH - 0.3, targetY.current));

    const x = Math.sin(angle.current) * halfW;
    const z = Math.cos(angle.current * 1.3) * halfD;
    const y = targetY.current;

    groupRef.current.position.set(
      Math.max(-halfW, Math.min(halfW, x)),
      y,
      Math.max(-halfD, Math.min(halfD, z)),
    );

    // Billboard face caméra : le sprite (profil) est toujours visible,
    // quelle que soit la direction de nage ou la vue (2D comme 3D).
    groupRef.current.quaternion.copy(camera.quaternion);

    // Flip horizontal selon la direction de nage projetée sur la droite caméra
    // (sprite généré tête à gauche : on le retourne s'il nage vers la droite de l'écran).
    dirVec.set(Math.cos(angle.current), 0, -1.3 * Math.sin(1.3 * angle.current)).normalize();
    rightVec.set(1, 0, 0).applyQuaternion(camera.quaternion);
    groupRef.current.scale.x = dirVec.dot(rightVec) > 0 ? -1 : 1;

    // Ondulation du corps simulée (léger tilt)
    groupRef.current.rotation.z = Math.sin(swimPhase.current) * 0.09;
    groupRef.current.rotation.x = Math.sin(swimPhase.current * 0.7) * 0.05;
  });

  if (!tex) return null; // sprite pas encore chargé

  return (
    <group ref={groupRef} position={initialPos}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        rotation={[0, 0, 0]}
      >
        <planeGeometry args={[w, s]} />
        <meshStandardMaterial
          map={tex}
          transparent
          alphaTest={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
          roughness={0.4}
        />
      </mesh>
      {isSelected && (
        <mesh position={[0, s * 0.1, 0]}>
          <ringGeometry args={[Math.max(w, s) * 0.55, Math.max(w, s) * 0.56, 32]} />
          <meshBasicMaterial color="#ffcc00" side={THREE.DoubleSide} transparent opacity={0.6} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
