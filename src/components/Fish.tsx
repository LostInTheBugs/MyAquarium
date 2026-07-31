import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TankSize } from '../types';
import { tankDimensions } from '../types';

interface FishProps {
  modelType: string;
  position: [number, number, number];
  scale: number;
  instanceId: string;
  tankSize: TankSize;
  isSelected: boolean;
  onSelect: () => void;
}

interface FishSpecies {
  bodyColor: string;
  accentColor: string;
  finColor: string;
  bellyColor: string;
  stripeColor?: string;
  bodyShape: 'normal' | 'tall' | 'elongated' | 'round';
  tailShape: 'forked' | 'round' | 'pointed' | 'large';
  size: number;
  speed: number;
}

const speciesMap: Record<string, FishSpecies> = {
  'fish-neon': { bodyColor: '#1133cc', accentColor: '#ff2222', finColor: '#aaccee', bellyColor: '#ddeeff', stripeColor: '#44eeff', bodyShape: 'normal', tailShape: 'forked', size: 0.18, speed: 0.6 },
  'fish-guppy': { bodyColor: '#ff6622', accentColor: '#ffaa00', finColor: '#ff9944', bellyColor: '#ffccaa', stripeColor: '#ff4400', bodyShape: 'normal', tailShape: 'large', size: 0.2, speed: 0.5 },
  'fish-angelfish': { bodyColor: '#c8c8c8', accentColor: '#333333', finColor: '#d8d8d8', bellyColor: '#eeeeee', stripeColor: '#222222', bodyShape: 'tall', tailShape: 'forked', size: 0.35, speed: 0.3 },
  'fish-betta': { bodyColor: '#cc1133', accentColor: '#880022', finColor: '#ff2244', bellyColor: '#ff8899', stripeColor: '#ff0044', bodyShape: 'normal', tailShape: 'large', size: 0.28, speed: 0.25 },
  'fish-molly': { bodyColor: '#ff8822', accentColor: '#cc6600', finColor: '#ff9944', bellyColor: '#ffddaa', bodyShape: 'normal', tailShape: 'round', size: 0.22, speed: 0.5 },
  'fish-cory': { bodyColor: '#8b7355', accentColor: '#5c4033', finColor: '#a08866', bellyColor: '#ccbb99', bodyShape: 'elongated', tailShape: 'forked', size: 0.16, speed: 0.7 },
  'fish-gold': { bodyColor: '#ee5511', accentColor: '#cc3300', finColor: '#ff6633', bellyColor: '#ffcc88', bodyShape: 'round', tailShape: 'forked', size: 0.3, speed: 0.35 },
  'fish-clown': { bodyColor: '#ff6622', accentColor: '#ffffff', finColor: '#ff8844', bellyColor: '#ffccaa', stripeColor: '#ffffff', bodyShape: 'normal', tailShape: 'round', size: 0.22, speed: 0.45 },
  'fish-tang': { bodyColor: '#2255dd', accentColor: '#ffcc00', finColor: '#3366ee', bellyColor: '#aaccee', stripeColor: '#1144bb', bodyShape: 'tall', tailShape: 'forked', size: 0.3, speed: 0.5 },
  'fish-butterfly': { bodyColor: '#ffcc00', accentColor: '#222222', finColor: '#ffdd44', bellyColor: '#ffeedd', stripeColor: '#000000', bodyShape: 'tall', tailShape: 'pointed', size: 0.26, speed: 0.4 },
  'fish-goby': { bodyColor: '#44aadd', accentColor: '#2277aa', finColor: '#66bbee', bellyColor: '#cceeff', stripeColor: '#3399cc', bodyShape: 'elongated', tailShape: 'round', size: 0.15, speed: 0.5 },
  'fish-damsel': { bodyColor: '#2244ee', accentColor: '#1133cc', finColor: '#3355ff', bellyColor: '#aaccff', bodyShape: 'normal', tailShape: 'forked', size: 0.16, speed: 0.65 },
};

const defaultSpecies: FishSpecies = { bodyColor: '#8899aa', accentColor: '#556677', finColor: '#99aabb', bellyColor: '#ccddee', bodyShape: 'normal', tailShape: 'forked', size: 0.2, speed: 0.5 };

export function Fish({ modelType, position: initialPos, tankSize, scale, isSelected, onSelect }: FishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const dims = tankDimensions(tankSize);

  const species = useMemo(() => speciesMap[modelType] || defaultSpecies, [modelType]);

  const speed = useMemo(() => species.speed * (0.8 + Math.random() * 0.4), [species.speed]);
  const angle = useRef(Math.random() * Math.PI * 2);
  const swimPhase = useRef(Math.random() * Math.PI * 2);
  const targetY = useRef(initialPos[1]);

  const s = scale * species.size * 2.5;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const halfW = dims.width / 2 - 0.8;
    const halfH = dims.height / 2 - 0.8;
    const halfD = dims.depth / 2 - 0.8;

    angle.current += delta * speed * 0.8;
    swimPhase.current += delta * 8;

    // Smooth direction changes
    const dirChange = Math.sin(Date.now() * 0.0003 + parseFloat(groupRef.current.uuid.slice(0, 4)) * 10) * 0.01;
    angle.current += dirChange;

    // Vertical movement
    targetY.current += (Math.sin(Date.now() * 0.0005 + swimPhase.current) * 0.005);
    targetY.current = Math.max(-halfH + 0.3, Math.min(halfH - 0.3, targetY.current));

    const x = Math.sin(angle.current) * halfW;
    const z = Math.cos(angle.current * 1.3) * halfD;
    const y = targetY.current;

    groupRef.current.position.set(
      Math.max(-halfW, Math.min(halfW, x)),
      y,
      Math.max(-halfD, Math.min(halfD, z))
    );

    // Body undulation
    if (bodyRef.current) {
      const undulation = Math.sin(swimPhase.current) * 0.08;
      bodyRef.current.rotation.y = undulation;
    }

    // Tail wag
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(swimPhase.current * 1.5) * 0.4;
    }

    groupRef.current.rotation.y = -angle.current + Math.PI;
  });

  return (
    <group ref={groupRef} position={initialPos} scale={s}>
      <group ref={bodyRef} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        {/* Main body */}
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.22, 8, 12]} />
          <meshStandardMaterial
            color={species.bodyColor}
            roughness={0.25}
            metalness={0.08}
          />
        </mesh>

        {/* Belly (lighter underside) */}
        <mesh position={[0, -0.08, 0]}>
          <capsuleGeometry args={[0.1, 0.18, 6, 8]} />
          <meshStandardMaterial color={species.bellyColor} roughness={0.3} />
        </mesh>

        {/* Stripe */}
        {species.stripeColor && (
          <mesh position={[0, 0.03, 0.09]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.22, 0.025, 0.01]} />
            <meshStandardMaterial color={species.stripeColor} roughness={0.2} emissive={species.stripeColor} emissiveIntensity={0.3} />
          </mesh>
        )}

        {/* Head */}
        <mesh position={[0.14, 0.01, 0]} castShadow>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={species.bodyColor} roughness={0.2} metalness={0.05} />
        </mesh>

        {/* Eyes (both sides) */}
        {[0.07, -0.07].map((zOff, i) => (
          <group key={`eye-${i}`}>
            <mesh position={[0.18, 0.04, zOff]}>
              <sphereGeometry args={[0.025, 10, 10]} />
              <meshStandardMaterial color="white" roughness={0.1} />
            </mesh>
            <mesh position={[0.19, 0.045, zOff * 1.5]}>
              <sphereGeometry args={[0.014, 8, 8]} />
              <meshStandardMaterial color="black" roughness={0.1} />
            </mesh>
          </group>
        ))}

        {/* Mouth */}
        <mesh position={[0.2, -0.01, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.02, 0.015, 0.03]} />
          <meshStandardMaterial color="#440000" roughness={0.3} />
        </mesh>

        {/* Dorsal fin */}
        <mesh position={[-0.03, 0.1, 0]} rotation={[0.1, 0, 0.15]} castShadow>
          <coneGeometry args={[0.07, 0.15, 6]} />
          <meshStandardMaterial
            color={species.finColor}
            roughness={0.3}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Pectoral fins (side fins) */}
        {[0.07, -0.07].map((zOff, i) => (
          <mesh
            key={`pec-${i}`}
            position={[0.05, -0.02, zOff]}
            rotation={[0.5, zOff > 0 ? 0.6 : -0.6, 0.8]}
          >
            <planeGeometry args={[0.06, 0.04]} />
            <meshStandardMaterial
              color={species.finColor}
              roughness={0.3}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Ventral/anal fin */}
        <mesh position={[-0.08, -0.1, 0]} rotation={[-0.2, 0, 0]}>
          <coneGeometry args={[0.04, 0.08, 5]} />
          <meshStandardMaterial
            color={species.finColor}
            roughness={0.3}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Tail fin (caudal) */}
        <mesh ref={tailRef} position={[-0.16, 0, 0]} castShadow>
          {species.tailShape === 'large' ? (
            <coneGeometry args={[0.1, 0.15, 6]} />
          ) : species.tailShape === 'forked' ? (
            <coneGeometry args={[0.08, 0.12, 5]} />
          ) : species.tailShape === 'pointed' ? (
            <coneGeometry args={[0.06, 0.14, 5]} />
          ) : (
            <coneGeometry args={[0.07, 0.1, 6]} />
          )}
          <meshStandardMaterial
            color={species.finColor}
            roughness={0.25}
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.22, 0.015, 16, 32]} />
          <meshBasicMaterial color="#ffcc00" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}
