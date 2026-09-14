import { useMemo } from 'react';
import * as THREE from 'three';
import type { TankSize, WaterType } from '../types';
import { tankDimensions } from '../types';
import { useTextureSafe, SUBSTRATE_TEXTURES, ROCK_SPRITES } from './textures';
import { Billboard } from './Billboard';

interface SandFloorProps {
  size: TankSize;
  waterType: WaterType;
  substrateType?: string;
  graphicsQuality?: string;
}

/** Couleur de repli quand la texture n'est pas disponible. */
function fallbackColor(substrateType: string | undefined, waterType: WaterType): string {
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
}

export function SandFloor({ size, waterType, substrateType, graphicsQuality = 'high' }: SandFloorProps) {
  const dims = tankDimensions(size);
  const highQuality = graphicsQuality !== 'low';

  // Substrat visuel : celui choisi, sinon un sable par défaut selon le type
  // d'eau (le sol n'est jamais un bloc uni).
  const effectiveSubstrate = substrateType ?? (waterType === 'marine' ? 'marine-sand' : 'sand-light');
  const texEntry = SUBSTRATE_TEXTURES[effectiveSubstrate] ?? undefined;
  const albedo = useTextureSafe(texEntry?.albedo ?? null);
  const normal = useTextureSafe(texEntry?.normal ?? null);

  // Tuilage : 1 tuile de texture ≈ 1.2 unités de bac
  const repeats = useMemo(() => {
    const tile = 1.2;
    return {
      x: Math.max(1, Math.round(dims.width / tile)),
      y: Math.max(1, Math.round(dims.depth / tile)),
    };
  }, [dims]);

  const albedoTex = useMemo(() => {
    if (!albedo) return null;
    const t = albedo.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeats.x, repeats.y);
    t.anisotropy = 8;
    return t;
  }, [albedo, repeats]);

  const normalTex = useMemo(() => {
    if (!normal) return null;
    const t = normal.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeats.x, repeats.y);
    t.colorSpace = THREE.NoColorSpace; // normal map : espace linéaire
    return t;
  }, [normal, repeats]);

  const color = fallbackColor(substrateType, waterType);
  const edgeColor = useMemo(() => {
    const c = new THREE.Color(color);
    return c.multiplyScalar(0.55).getStyle();
  }, [color]);

  // Quelques roches sprites (billboards croisés) posées sur le substrat
  const rocks = useMemo(() => {
    const count = highQuality ? (size === 'large' ? 6 : size === 'medium' ? 4 : 2) : 0;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: [
        (Math.random() - 0.5) * (dims.width - 1.4),
        -dims.height / 2 + 0.16,
        (Math.random() - 0.5) * (dims.depth - 1.4),
      ] as [number, number, number],
      rot: [0, Math.random() * Math.PI, 0] as [number, number, number],
      w: 0.18 + Math.random() * 0.22,
      h: 0.14 + Math.random() * 0.2,
      tex: ROCK_SPRITES[i % ROCK_SPRITES.length],
      seed: Math.random(),
    }));
  }, [dims, size, highQuality]);

  return (
    <group>
      {/* Lit de substrat : boîte (bords) + plan texturé (surface) */}
      <mesh position={[0, -dims.height / 2 + 0.06, 0]} receiveShadow>
        <boxGeometry args={[dims.width - 0.15, 0.12, dims.depth - 0.15]} />
        <meshStandardMaterial color={edgeColor} roughness={0.9} metalness={0} />
      </mesh>

      <mesh position={[0, -dims.height / 2 + 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[dims.width - 0.18, dims.depth - 0.18]} />
        <meshStandardMaterial
          color={albedoTex ? '#ffffff' : color}
          map={albedoTex ?? undefined}
          normalMap={normalTex ?? undefined}
          normalScale={new THREE.Vector2(0.55, 0.55)}
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      {/* Roches sprites */}
      {highQuality && rocks.map((r) => (
        <RockSprite key={`rs-${r.id}`} url={r.tex} width={r.w} height={r.h} planes={3}
          position={[r.pos[0], r.pos[1] + r.h / 2, r.pos[2]]} rotation={r.rot} seed={r.seed} />
      ))}
    </group>
  );
}

/** Sprite de roche : charge sa propre texture (indépendant du substrat). */
function RockSprite({ url, width, height, planes, position, rotation, seed }: {
  url: string; width: number; height: number; planes: number;
  position: [number, number, number]; rotation: [number, number, number]; seed: number;
}) {
  const tex = useTextureSafe(url);
  return <Billboard texture={tex} width={width} height={height} planes={planes} position={position} rotation={rotation} seed={seed} />;
}
