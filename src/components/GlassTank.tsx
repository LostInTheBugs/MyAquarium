import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TankSize, WaterType } from '../types';
import { tankDimensions } from '../types';

interface GlassTankProps {
  size: TankSize;
  waterType: WaterType;
  graphicsQuality?: 'low' | 'medium' | 'high';
}

/**
 * Carte de normales procédurale (tuilable) pour la surface de l'eau :
 * somme d'ondes directionnelles à fréquences entières → normales animées
 * par simple défilement (offset) chaque frame.
 */
function makeSurfaceNormalMap(): THREE.Texture {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const ctx = cv.getContext('2d')!;
  const img = ctx.createImageData(S, S);
  const waves: [number, number, number][] = [
    [1, 2, 1.0],
    [2, -1, 0.7],
    [1, 1, 0.5],
    [3, 1, 0.35],
    [-1, 2, 0.5],
  ];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const u = x / S;
      const v = y / S;
      let sx = 0;
      let sy = 0;
      for (const [fx, fy, amp] of waves) {
        const p = 2 * Math.PI * (fx * u + fy * v);
        sx += amp * fx * Math.cos(p);
        sy += amp * fy * Math.cos(p);
      }
      const k = 0.28;
      const nx = -sx * k;
      const ny = -sy * k;
      const len = Math.hypot(nx, ny, 1);
      const i = (y * S + x) * 4;
      img.data[i] = Math.round(((nx / len) * 0.5 + 0.5) * 255);
      img.data[i + 1] = Math.round(((ny / len) * 0.5 + 0.5) * 255);
      img.data[i + 2] = Math.round(((1 / len) * 0.5 + 0.5) * 255);
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

export function GlassTank({ size, waterType, graphicsQuality = 'high' }: GlassTankProps) {
  const dims = tankDimensions(size);
  const surfaceRef = useRef<THREE.Mesh>(null);

  const glassThickness = 0.12;
  const frameWidth = 0.06;
  const w = dims.width;
  const h = dims.height;
  const d = dims.depth;
  const highQuality = graphicsQuality !== 'low';

  const frameColor = waterType === 'marine' ? '#151f28' : '#151f18';
  const glassTint = waterType === 'marine' ? '#dff0fa' : '#e8f6ee';
  const waterTint = waterType === 'marine' ? '#aedcf2' : '#bfe6d2';

  // Surface geometry in XY plane (no pre-rotation — the mesh applies rotation-x)
  const surfaceGeom = useMemo(() => {
    const geom = new THREE.PlaneGeometry(w - 0.2, d - 0.2, 40, 40);
    return geom;
  }, [w, d]);

  // Normales animées de la surface (défilement continu)
  const surfaceNormal = useMemo(() => {
    const t = makeSurfaceNormalMap();
    t.repeat.set(3, 2);
    return t;
  }, []);

  useFrame(() => {
    // Animate water surface — waves along the mesh-local Z axis (vertical in world space)
    if (surfaceRef.current && highQuality) {
      const pos = surfaceRef.current.geometry.attributes.position;
      const t = Date.now() * 0.0008;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        pos.setZ(i,
          Math.sin(x * 2.5 + t) * 0.02 +
          Math.cos(y * 2 + t * 1.1) * 0.018 +
          Math.sin((x + y) * 1.5 + t * 0.7) * 0.01
        );
      }
      pos.needsUpdate = true;
      surfaceRef.current.geometry.computeVertexNormals();
    }
    // Défilement des normales de surface (scintillement lumineux)
    const ts = Date.now() * 0.001;
    surfaceNormal.offset.set(ts * 0.012, ts * 0.009);
  });

  // Verre SANS transmission : three.js ne rend PAS les objets transparents
  // (sprites poissons/plantes/coraux, bulles, particules) dans la passe de
  // transmission → ils disparaissaient entièrement derrière les vitres.
  // Verre transparent classique : teinte légère + reflets env + clearcoat,
  // le tri par profondeur se fait tout seul (vitres devant le contenu du bac).
  const glassPanelMaterial = useMemo(() => (
    <meshPhysicalMaterial
      color={glassTint}
      metalness={0}
      roughness={0.03}
      transparent
      opacity={0.1}
      envMapIntensity={0.85}
      clearcoat={1}
      clearcoatRoughness={0.03}
      specularIntensity={1}
      specularColor="#ffffff"
      depthWrite={false}
    />
  ), [glassTint]);

  const surfaceMaterial = useMemo(() => (
    <meshPhysicalMaterial
      color="#cfeaf6"
      roughness={0.06}
      metalness={0.05}
      transparent
      opacity={0.42}
      envMapIntensity={0.7}
      clearcoat={0.6}
      clearcoatRoughness={0.05}
      normalMap={surfaceNormal}
      normalScale={new THREE.Vector2(0.5, 0.5)}
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  ), [surfaceNormal]);

  const panelGeom = useMemo(() => ({
    frontBack: new THREE.BoxGeometry(w + glassThickness * 2, h, glassThickness),
    side: new THREE.BoxGeometry(glassThickness, h, d),
    bottom: new THREE.BoxGeometry(w, glassThickness, d),
  }), [w, h, d, glassThickness]);

  return (
    <group>
      {/* === GLASS PANELS === */}
      {/* Front */}
      <mesh position={[0, 0, d / 2 + glassThickness / 2]} geometry={panelGeom.frontBack}>
        {glassPanelMaterial}
      </mesh>
      {/* Back */}
      <mesh position={[0, 0, -d / 2 - glassThickness / 2]} geometry={panelGeom.frontBack}>
        {glassPanelMaterial}
      </mesh>
      {/* Left */}
      <mesh position={[-w / 2 - glassThickness / 2, 0, 0]} geometry={panelGeom.side}>
        {glassPanelMaterial}
      </mesh>
      {/* Right */}
      <mesh position={[w / 2 + glassThickness / 2, 0, 0]} geometry={panelGeom.side}>
        {glassPanelMaterial}
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -h / 2 - glassThickness / 2, 0]} geometry={panelGeom.bottom} receiveShadow>
        {glassPanelMaterial}
      </mesh>

      {/* === FRAME (top/bottom rims only) === */}
      <mesh position={[0, h / 2 + frameWidth / 2, 0]} castShadow>
        <boxGeometry args={[w + glassThickness * 2 + frameWidth, frameWidth, d + glassThickness * 2 + frameWidth]} />
        <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.8} />
      </mesh>
      <mesh position={[0, -h / 2 - glassThickness - frameWidth / 2, 0]} receiveShadow>
        <boxGeometry args={[w + glassThickness * 2 + frameWidth, frameWidth, d + glassThickness * 2 + frameWidth]} />
        <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.8} />
      </mesh>

      {/* Corner posts */}
      {[
        [-w / 2 - glassThickness, -d / 2 - glassThickness],
        [w / 2 + glassThickness, -d / 2 - glassThickness],
        [-w / 2 - glassThickness, d / 2 + glassThickness],
        [w / 2 + glassThickness, d / 2 + glassThickness],
      ].map(([cx, cz], i) => (
        <mesh key={`corner-${i}`} position={[cx, 0, cz]} castShadow>
          <boxGeometry args={[frameWidth * 0.7, h + frameWidth * 2, frameWidth * 0.7]} />
          <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.75} />
        </mesh>
      ))}

      {/* === VOLUME D'EAU === */}
      {/* Teinte très légère : donne la présence de l'eau sans effet de voile */}
      <mesh position={[0, -0.025, 0]}>
        <boxGeometry args={[w - 0.24, h - 0.31, d - 0.24]} />
        <meshBasicMaterial color={waterTint} transparent opacity={0.055} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Ligne de niveau d'eau (ménisque) : bande fine et claire à la surface */}
      <mesh position={[0, h / 2 - 0.18, 0]}>
        <boxGeometry args={[w - 0.18, 0.02, d - 0.18]} />
        <meshBasicMaterial color="#e8f7fb" transparent opacity={0.45} depthWrite={false} />
      </mesh>

      {/* === WATER SURFACE === */}
      {/* The geometry is a plane in XY; rotation-x tips it horizontal (XZ plane in world) */}
      <mesh ref={surfaceRef} position={[0, h / 2 - 0.18, 0]} rotation-x={-Math.PI / 2} geometry={surfaceGeom}>
        {surfaceMaterial}
      </mesh>

      {/* Subtle internal glass highlights */}
      {[
        { pos: [0, 0, d / 2 - 0.01], scale: [w - 0.1, h - 0.1] },
        { pos: [-w / 2 + 0.01, 0, 0], rot: [0, Math.PI / 2, 0], scale: [d - 0.1, h - 0.1] },
        { pos: [w / 2 - 0.01, 0, 0], rot: [0, Math.PI / 2, 0], scale: [d - 0.1, h - 0.1] },
      ].map((panel, i) => (
        <mesh key={`hl-${i}`} position={panel.pos as [number, number, number]} rotation={(panel.rot || [0,0,0]) as [number, number, number]}>
          <planeGeometry args={panel.scale as [number, number]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.03} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
