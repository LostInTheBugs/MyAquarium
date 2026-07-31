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

// ─── Procedural fish species data ───

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
  'fish-guppy': { bodyColor: '#ff6622', accentColor: '#ffaa00', finColor: '#ff9944', bellyColor: '#ffccaa', bodyShape: 'normal', tailShape: 'large', size: 0.2, speed: 0.5 },
  'fish-angelfish': { bodyColor: '#c8c8c8', accentColor: '#333333', finColor: '#d8d8d8', bellyColor: '#eeeeee', stripeColor: '#222222', bodyShape: 'tall', tailShape: 'forked', size: 0.35, speed: 0.3 },
  'fish-betta': { bodyColor: '#cc1133', accentColor: '#880022', finColor: '#ff2244', bellyColor: '#ff8899', bodyShape: 'normal', tailShape: 'large', size: 0.28, speed: 0.25 },
  'fish-molly': { bodyColor: '#ff8822', accentColor: '#cc6600', finColor: '#ff9944', bellyColor: '#ffddaa', bodyShape: 'normal', tailShape: 'round', size: 0.22, speed: 0.5 },
  'fish-cory': { bodyColor: '#8b7355', accentColor: '#5c4033', finColor: '#a08866', bellyColor: '#ccbb99', bodyShape: 'elongated', tailShape: 'forked', size: 0.16, speed: 0.7 },
  'fish-gold': { bodyColor: '#ee5511', accentColor: '#cc3300', finColor: '#ff6633', bellyColor: '#ffcc88', bodyShape: 'round', tailShape: 'forked', size: 0.3, speed: 0.35 },
  'fish-clown': { bodyColor: '#ff6622', accentColor: '#ffffff', finColor: '#ff8844', bellyColor: '#ffccaa', stripeColor: '#ffffff', bodyShape: 'normal', tailShape: 'round', size: 0.22, speed: 0.45 },
  'fish-tang': { bodyColor: '#2255dd', accentColor: '#ffcc00', finColor: '#3366ee', bellyColor: '#aaccee', bodyShape: 'tall', tailShape: 'forked', size: 0.3, speed: 0.5 },
  'fish-butterfly': { bodyColor: '#ffcc00', accentColor: '#222222', finColor: '#ffdd44', bellyColor: '#ffeedd', bodyShape: 'tall', tailShape: 'pointed', size: 0.26, speed: 0.4 },
  'fish-goby': { bodyColor: '#44aadd', accentColor: '#2277aa', finColor: '#66bbee', bellyColor: '#cceeff', bodyShape: 'elongated', tailShape: 'round', size: 0.15, speed: 0.5 },
  'fish-damsel': { bodyColor: '#2244ee', accentColor: '#1133cc', finColor: '#3355ff', bellyColor: '#aaccff', bodyShape: 'normal', tailShape: 'forked', size: 0.16, speed: 0.65 },
};
const defaultSpecies: FishSpecies = { bodyColor: '#8899aa', accentColor: '#556677', finColor: '#99aabb', bellyColor: '#ccddee', bodyShape: 'normal', tailShape: 'forked', size: 0.2, speed: 0.5 };

// ─── GLTF support: place .glb files in /public/models/fish/ ───
// Then: import { useGLTF } from '@react-three/drei';
// const { scene } = useGLTF('/models/fish/clownfish.glb');
// return <primitive object={scene} />;

// ─── Procedural fish ───

function ProceduralFish({
  species, scale, isSelected, onSelect,
  bodyRef, tailRef, dorsalRef, lPecRef, rPecRef,
}: {
  species: FishSpecies; scale: number; isSelected: boolean; onSelect: () => void;
  bodyRef: React.Ref<THREE.Group>; tailRef: React.Ref<THREE.Mesh>;
  dorsalRef: React.Ref<THREE.Mesh>; lPecRef: React.Ref<THREE.Mesh>; rPecRef: React.Ref<THREE.Mesh>;
}) {
  const bLen = 0.3 * scale;
  const bH = 0.15 * scale;
  const bW = 0.08 * scale;

  // Body shape variations
  const bodyGeom = useMemo(() => {
    const shape = new THREE.Shape();
    if (species.bodyShape === 'tall') {
      shape.moveTo(-bLen / 2, bH * 0.9);
      shape.quadraticCurveTo(0, bH * 1.3, bLen / 2, bH * 0.2);
      shape.lineTo(bLen / 2, -bH * 0.2);
      shape.quadraticCurveTo(0, -bH * 0.7, -bLen / 2, 0);
    } else if (species.bodyShape === 'round') {
      shape.moveTo(-bLen / 2, 0);
      shape.quadraticCurveTo(-bLen * 0.2, bH * 0.8, bLen / 3, bH * 0.5);
      shape.quadraticCurveTo(bLen / 2, 0, bLen / 3, -bH * 0.4);
      shape.quadraticCurveTo(-bLen * 0.2, -bH * 0.6, -bLen / 2, 0);
    } else if (species.bodyShape === 'elongated') {
      shape.moveTo(-bLen / 2, bH * 0.2);
      shape.quadraticCurveTo(-bLen / 3, bH * 1.2, bLen / 3, bH * 0.3);
      shape.quadraticCurveTo(bLen / 2, bH * 0.1, bLen / 2, -bH * 0.1);
      shape.quadraticCurveTo(bLen / 3, -bH * 0.3, -bLen / 3, -bH * 0.5);
      shape.quadraticCurveTo(-bLen / 2, -bH * 0.2, -bLen / 2, bH * 0.2);
    } else {
      shape.moveTo(-bLen / 2, bH / 2);
      shape.quadraticCurveTo(-bLen / 2, 0, 0, -bH / 2);
      shape.lineTo(bLen / 2, -bH / 4);
      shape.quadraticCurveTo(bLen * 0.3, 0, bLen / 2, bH / 4);
      shape.lineTo(0, bH / 2);
    }
    const extConf = { steps: 1, depth: bW, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 };
    return new THREE.ExtrudeGeometry(shape, extConf);
  }, [bLen, bH, bW, species.bodyShape]);

  const tailGeom = useMemo(() => {
    if (species.tailShape === 'large') return new THREE.ConeGeometry(bH * 0.9, bLen * 0.45, 8);
    if (species.tailShape === 'forked') return new THREE.ConeGeometry(bH * 0.7, bLen * 0.4, 6);
    if (species.tailShape === 'pointed') return new THREE.ConeGeometry(bH * 0.5, bLen * 0.5, 5);
    return new THREE.ConeGeometry(bH * 0.6, bLen * 0.35, 7);
  }, [bH, bLen, species.tailShape]);

  return (
    <group onClick={(e) => { e.stopPropagation(); onSelect(); }} scale={scale}>
      {/* Main body group */}
      <group ref={bodyRef}>
        <mesh geometry={bodyGeom} castShadow>
          <meshStandardMaterial color={species.bodyColor} roughness={0.22} metalness={0.06} />
        </mesh>

        {/* Belly */}
        <mesh position={[0, -bH * 0.25, 0]}>
          <capsuleGeometry args={[bH * 0.55, bLen * 0.55, 6, 8]} />
          <meshStandardMaterial color={species.bellyColor} roughness={0.28} />
        </mesh>

        {/* Stripe */}
        {species.stripeColor && (
          <mesh position={[0, bH * 0.05, bW * 1.1]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[bLen * 0.7, bH * 0.08, 0.005]} />
            <meshStandardMaterial color={species.stripeColor} roughness={0.15} emissive={species.stripeColor} emissiveIntensity={0.25} />
          </mesh>
        )}

        {/* Head */}
        <mesh position={[bLen * 0.4, 0, 0]} castShadow>
          <sphereGeometry args={[bH * 0.55, 12, 12]} />
          <meshStandardMaterial color={species.bodyColor} roughness={0.18} metalness={0.04} />
        </mesh>

        {/* Eyes */}
        {[bW * 0.45, -bW * 0.45].map((zOff, i) => (
          <group key={`eye-${i}`}>
            <mesh position={[bLen * 0.52, bH * 0.15, zOff]}>
              <sphereGeometry args={[bH * 0.14, 10, 10]} />
              <meshStandardMaterial color="#ffffff" roughness={0.05} />
            </mesh>
            <mesh position={[bLen * 0.55, bH * 0.16, zOff * 1.4]}>
              <sphereGeometry args={[bH * 0.08, 8, 8]} />
              <meshStandardMaterial color="#111111" roughness={0.05} />
            </mesh>
          </group>
        ))}

        {/* Mouth */}
        <mesh position={[bLen * 0.6, -bH * 0.05, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[bH * 0.12, bH * 0.08, bW * 0.2]} />
          <meshStandardMaterial color="#330000" roughness={0.3} />
        </mesh>

        {/* Dorsal fin */}
        <mesh ref={dorsalRef} position={[-bLen * 0.05, bH * 0.55, 0]} rotation={[0.1, 0, 0.1]} castShadow>
          <coneGeometry args={[bH * 0.4, bLen * 0.5, 6]} />
          <meshStandardMaterial color={species.finColor} roughness={0.25} transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>

        {/* Pectoral fins */}
        <mesh ref={lPecRef} position={[bLen * 0.15, -bH * 0.15, bW * 0.6]} rotation={[0.6, 0.7, 0.8]}>
          <planeGeometry args={[bH * 0.35, bH * 0.25]} />
          <meshStandardMaterial color={species.finColor} roughness={0.28} transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={rPecRef} position={[bLen * 0.15, -bH * 0.15, -bW * 0.6]} rotation={[0.6, -0.7, -0.8]}>
          <planeGeometry args={[bH * 0.35, bH * 0.25]} />
          <meshStandardMaterial color={species.finColor} roughness={0.28} transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>

        {/* Ventral fin */}
        <mesh position={[-bLen * 0.25, -bH * 0.6, 0]} rotation={[-0.2, 0, 0]}>
          <coneGeometry args={[bH * 0.22, bLen * 0.25, 5]} />
          <meshStandardMaterial color={species.finColor} roughness={0.28} transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>

        {/* Tail fin */}
        <mesh ref={tailRef} position={[-bLen * 0.5, 0, 0]} castShadow>
          <primitive object={tailGeom} />
          <meshStandardMaterial color={species.finColor} roughness={0.2} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Selection ring */}
      {isSelected && (
        <mesh>
          <torusGeometry args={[bH * 1.6, bH * 0.08, 16, 32]} />
          <meshBasicMaterial color="#ffcc00" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

// ─── Main Fish (with swimming behavior) ───

export function Fish({ modelType, position: initialPos, tankSize, scale, isSelected, onSelect }: FishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const dorsalRef = useRef<THREE.Mesh>(null);
  const lPecRef = useRef<THREE.Mesh>(null);
  const rPecRef = useRef<THREE.Mesh>(null);
  const dims = tankDimensions(tankSize);

  const species = useMemo(() => speciesMap[modelType] || defaultSpecies, [modelType]);
  const speed = useMemo(() => species.speed * (0.8 + Math.random() * 0.4), [species.speed]);
  const angle = useRef(Math.random() * Math.PI * 2);
  const swimPhase = useRef(Math.random() * Math.PI * 2);
  const targetY = useRef(initialPos[1]);
  const velocityRef = useRef(0);
  const idleTimer = useRef(Math.random() * 5);

  const s = scale * species.size * 3;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const halfW = dims.width / 2 - 0.8;
    const halfH = dims.height / 2 - 0.8;
    const halfD = dims.depth / 2 - 0.8;

    // Idle behavior: sometimes pause
    idleTimer.current -= delta;
    const isIdle = idleTimer.current < 0;
    if (isIdle && Math.random() < 0.01) idleTimer.current = 2 + Math.random() * 8;

    const activeSpeed = isIdle ? speed * 0.05 : speed;
    angle.current += delta * activeSpeed * 0.8;
    swimPhase.current += delta * (isIdle ? 2 : 9);

    // Smooth random direction changes
    angle.current += Math.sin(Date.now() * 0.0004 + parseFloat(groupRef.current.uuid.slice(0, 4))) * 0.008;

    // Vertical bobbing
    targetY.current += Math.sin(Date.now() * 0.0006 + swimPhase.current) * 0.004;
    targetY.current = Math.max(-halfH + 0.3, Math.min(halfH - 0.3, targetY.current));

    const x = Math.sin(angle.current) * halfW;
    const z = Math.cos(angle.current * 1.3) * halfD;
    const y = targetY.current;

    // Clamp
    groupRef.current.position.set(
      Math.max(-halfW, Math.min(halfW, x)),
      y,
      Math.max(-halfD, Math.min(halfD, z))
    );

    // Body undulation
    if (bodyRef.current) {
      velocityRef.current = activeSpeed;
      bodyRef.current.rotation.y = Math.sin(swimPhase.current) * 0.06;
    }

    // Fin animations
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(swimPhase.current * 1.5) * 0.35;
    if (lPecRef.current) lPecRef.current.rotation.x = 0.6 + Math.sin(swimPhase.current + 1) * 0.15;
    if (rPecRef.current) rPecRef.current.rotation.x = 0.6 + Math.sin(swimPhase.current + 1) * 0.15;

    groupRef.current.rotation.y = -angle.current + Math.PI;
  });

  return (
    <group ref={groupRef} position={initialPos}>
      <ProceduralFish species={species} scale={s} isSelected={isSelected} onSelect={onSelect}
        bodyRef={bodyRef} tailRef={tailRef} dorsalRef={dorsalRef} lPecRef={lPecRef} rPecRef={rPecRef} />
    </group>
  );
}
