import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { TankSize } from '../types';
import { tankDimensions } from '../types';
import { useTextureSafe, FISH_SPRITES, FISH_FACING, FISH_ATLAS } from './textures';

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

// ─── Poissons sprite (billboard orienté, nage animée) ───
//
// Deux couches d'animation :
//   - frames de nage réelles : atlas keyés des clips LTX (FISH_ATLAS), l'offset
//     de texture avance par frame — c'est ce qui donne la nage visible ;
//   - ondulation shader (vertex, onBeforeCompile) : S-curve du corps + battement
//     de queue, atténuée quand les frames tournent (elles font déjà le travail).
// Le déplacement combine nage par élans (burst & coast), dérive de cap, bobbing
// vertical avec tangage, et trajectoire Lissajous propre à chaque poisson.

export function Fish({ modelType, position: initialPos, tankSize, scale, isSelected, onSelect }: FishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dims = tankDimensions(tankSize);
  const camera = useThree(s => s.camera);
  const rightVec = useMemo(() => new THREE.Vector3(), []);
  const dirVec = useMemo(() => new THREE.Vector3(), []);

  const species = useMemo(() => speciesMap[modelType] || defaultSpecies, [modelType]);
  const url = FISH_SPRITES[modelType] || FISH_SPRITES['fish-neon'];
  const tex = useTextureSafe(url);
  // Atlas de nage (frames LTX keyées). Tant qu'il n'est pas prêt (ou si
  // l'espèce n'en a pas), le poisson garde son sprite statique.
  const atlasInfo = FISH_ATLAS[modelType];
  const atlasTex = useTextureSafe(atlasInfo?.url);
  const animated = !!(atlasInfo && atlasTex);
  const speed = useMemo(() => species.speed * (0.8 + Math.random() * 0.4), [species.speed]);
  // Phase stable par poisson (remplace un parseFloat(uuid) qui donnait NaN
  // dès que l'uuid commençait par une lettre → poisson invisible).
  const phaseSeed = useMemo(() => Math.random() * Math.PI * 2, []);
  // Variations individuelles (trajectoire + rythme de nage)
  const zFreq = useMemo(() => 1.05 + Math.random() * 0.5, []);
  const burstRate = useMemo(() => 0.22 + Math.random() * 0.25, []);
  const tailRate = useMemo(() => 0.85 + Math.random() * 0.4, []);
  const angle = useRef(Math.random() * Math.PI * 2);
  const swimPhase = useRef(Math.random() * Math.PI * 2);
  const targetY = useRef(initialPos[1]);
  const prevY = useRef(initialPos[1]);
  const ampRef = useRef(1);
  const idleTimer = useRef(Math.random() * 5);

  const s = scale * species.size * 3;
  const w = useMemo(() => {
    const img = (animated ? atlasTex!.image : tex?.image) as HTMLImageElement | undefined;
    if (img && img.width) {
      // largeur d'une frame d'atlas (l'atlas entier contient `frames` frames)
      const fw = animated ? img.width / atlasInfo!.frames : img.width;
      return s * (fw / img.height);
    }
    return s * 2.2;
  }, [s, tex, atlasTex, animated, atlasInfo]);

  // Texture rendue : clone de l'atlas avec un offset par frame (le clone
  // partage la source GPU → un seul upload par espèce), sinon sprite statique.
  const dispTex = useMemo(() => {
    if (!atlasInfo || !atlasTex) return tex;
    const c = atlasTex.clone();
    c.repeat.set(1 / atlasInfo.frames, 1);
    c.offset.set(0, 0);
    c.wrapS = THREE.ClampToEdgeWrapping;
    c.needsUpdate = true;
    return c;
  }, [atlasTex, atlasInfo, tex]);

  // Matériau : albédo du sprite + ondulation de nage dans le vertex shader.
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: dispTex ?? undefined,
      transparent: true,
      alphaTest: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
      roughness: 0.4,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uPhase = { value: phaseSeed };
      shader.uniforms.uAmp = { value: 0 };
      shader.uniforms.uFreq = { value: 6 };
      shader.uniforms.uW = { value: 1 };
      shader.uniforms.uH = { value: 1 };
      shader.vertexShader = `
        uniform float uTime;
        uniform float uPhase;
        uniform float uAmp;
        uniform float uFreq;
        uniform float uW;
        uniform float uH;
      ` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        // b : 0 = tête (x=-w/2), 1 = queue (x=+w/2)
        float fishB = clamp(position.x / uW + 0.5, 0.0, 1.0);
        // Ondulation du corps : S-curve, amplitude croissante vers la queue
        float fishWave = sin(uPhase + uTime * uFreq - fishB * 4.2);
        transformed.y += fishWave * uAmp * 0.15 * uH * pow(fishB, 1.6);
        // Battement de queue : recul/avancée du corps ancré à la tête
        float fishSqueeze = 1.0 - uAmp * 0.16 * sin(uPhase + uTime * uFreq - 0.9) * pow(fishB, 2.4);
        transformed.x = -uW * 0.5 + (transformed.x + uW * 0.5) * fishSqueeze;`,
      );
      m.userData.shader = shader;
    };
    m.customProgramCacheKey = () => 'fish-swim-v1';
    return m;
  }, [dispTex, phaseSeed]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);
    const halfW = dims.width / 2 - 0.8;
    const halfH = dims.height / 2 - 0.8;
    const halfD = dims.depth / 2 - 0.8;
    const t = Date.now() * 0.001;

    // Comportement d'arrêt occasionnel
    idleTimer.current -= dt;
    const isIdle = idleTimer.current < 0;
    if (isIdle && Math.random() < 0.01) idleTimer.current = 2 + Math.random() * 8;

    // Nage par élans (burst & coast) : la vitesse ondule au lieu d'être constante
    const burst =
      0.6 +
      0.34 * Math.sin(t * burstRate + phaseSeed * 2.0) +
      0.16 * Math.sin(t * burstRate * 2.7 + phaseSeed * 3.1);
    const activeSpeed = isIdle ? speed * 0.04 : speed * Math.max(0.22, burst);
    angle.current += dt * activeSpeed * 0.75;

    // Cadence de nage liée à la vitesse (rad/s), propre au poisson
    const swimRate = (isIdle ? 1.8 : 5.0 + activeSpeed * 6.0) * tailRate;
    swimPhase.current += dt * swimRate;

    // Amplitude lissée : réduite quand le poisson est à l'arrêt
    const ampTarget = isIdle ? 0.35 : 1;
    ampRef.current += (ampTarget - ampRef.current) * Math.min(1, dt * 3);

    // Dérive douce de cap
    angle.current += Math.sin(t * 0.4 + phaseSeed) * 0.008;

    // Bobbing vertical + tangage selon la vitesse verticale
    targetY.current += Math.sin(t * 0.6 + swimPhase.current) * 0.004;
    targetY.current = Math.max(-halfH + 0.3, Math.min(halfH - 0.3, targetY.current));
    const vy = (targetY.current - prevY.current) / Math.max(dt, 1e-3);
    prevY.current = targetY.current;

    // Trajectoire Lissajous propre au poisson (fréquences variées)
    const x = Math.sin(angle.current) * halfW * 0.9;
    const z = Math.cos(angle.current * zFreq) * halfD * 0.92;
    const y = targetY.current;

    groupRef.current.position.set(
      Math.max(-halfW, Math.min(halfW, x)),
      y,
      Math.max(-halfD, Math.min(halfD, z)),
    );

    // Billboard face caméra : le sprite (profil) est toujours visible,
    // quelle que soit la direction de nage ou la vue (2D comme 3D).
    groupRef.current.quaternion.copy(camera.quaternion);

    // Flip horizontal : sens natif du sprite (FISH_FACING) vs sens de
    // déplacement projeté sur la droite caméra — le poisson montre sa TÊTE
    // dans le sens de la nage (corrige la nage "à reculons").
    // Dérivée exacte de la trajectoire (x = sin·halfW·0.9, z = cos(zFreq·angle)·halfD·0.92).
    dirVec.set(
      Math.cos(angle.current) * halfW * 0.9,
      0,
      -Math.sin(angle.current * zFreq) * zFreq * halfD * 0.92,
    ).normalize();
    rightVec.set(1, 0, 0).applyQuaternion(camera.quaternion);
    const facingRight = (FISH_FACING[modelType] ?? 'left') === 'right';
    const movingRight = dirVec.dot(rightVec) > 0;
    groupRef.current.scale.x = facingRight === movingRight ? 1 : -1;

    // Tangage (montée/descente) + léger roulis de nage. rotateX/rotateZ
    // multiplient le quaternion (préserve l'orientation billboard).
    groupRef.current.rotateX(THREE.MathUtils.clamp(vy * 0.3, -0.22, 0.22));
    groupRef.current.rotateZ(Math.sin(swimPhase.current) * 0.1 * ampRef.current);

    // Uniformes du shader de nage
    const sh = material.userData.shader;
    if (sh) {
      sh.uniforms.uTime.value = t;
      sh.uniforms.uW.value = w;
      sh.uniforms.uH.value = s;
      // Amplitude atténuée quand les frames animées font déjà la nage
      sh.uniforms.uAmp.value = ampRef.current * (animated ? 0.55 : 1);
      sh.uniforms.uFreq.value = swimRate;
    }

    // Frames d'atlas : avance l'offset de texture (aucun re-upload GPU).
    // Cadence liée au poisson ; ralentie quand il est à l'arrêt.
    if (animated && atlasInfo && dispTex) {
      const fps = isIdle ? 4.5 : 11 * (0.8 + tailRate * 0.35);
      const fi = Math.floor(t * fps + phaseSeed * 4) % atlasInfo.frames;
      dispTex.offset.x = fi / atlasInfo.frames;
    }
  });

  if (!tex) return null; // sprite pas encore chargé

  return (
    <group ref={groupRef} position={initialPos}>
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        <planeGeometry args={[w, s, 24, 12]} />
        <primitive object={material} attach="material" />
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
