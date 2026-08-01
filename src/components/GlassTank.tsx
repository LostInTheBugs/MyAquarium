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

export function GlassTank({ size, waterType, graphicsQuality = 'high' }: GlassTankProps) {
  const dims = tankDimensions(size);
  const surfaceRef = useRef<THREE.Mesh>(null);
  const waterRef = useRef<THREE.Mesh>(null);

  const glassThickness = 0.12;
  const frameWidth = 0.06;
  const w = dims.width;
  const h = dims.height;
  const d = dims.depth;
  const highQuality = graphicsQuality === 'high';

  const waterColor = waterType === 'marine' ? '#0a3f5c' : '#1a4a35';
  const frameColor = waterType === 'marine' ? '#151f28' : '#151f18';
  const glassTint = waterType === 'marine' ? '#b8ddf0' : '#c8eed8';

  const surfaceGeom = useMemo(() => {
    const geom = new THREE.PlaneGeometry(w - 0.2, d - 0.2, 40, 40);
    geom.rotateX(-Math.PI / 2);
    return geom;
  }, [w, d]);

  useFrame((_, delta) => {
    // Animate water surface
    if (surfaceRef.current && highQuality) {
      const pos = surfaceRef.current.geometry.attributes.position;
      const t = Date.now() * 0.0008;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getY(i);
        pos.setZ(i, Math.sin(x * 2.5 + t) * 0.02 + Math.cos(z * 2 + t * 1.1) * 0.018 + Math.sin((x + z) * 1.5 + t * 0.7) * 0.01);
      }
      pos.needsUpdate = true;
    }
    // Subtle water color shift
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.MeshPhysicalMaterial;
      mat.opacity = 0.42 + Math.sin(Date.now() * 0.0005) * 0.03;
    }
    delta;
  });

  // Glass material — uses transmission for realistic glass in high quality
  const glassMaterial = useMemo(() => {
    if (highQuality) {
      return (
        <meshPhysicalMaterial
          color={glassTint}
          metalness={0}
          roughness={0.05}
          transmission={0.92}
          thickness={glassThickness}
          ior={1.45}
          envMapIntensity={0.6}
          clearcoat={0.3}
          clearcoatRoughness={0.05}
          specularIntensity={1}
          specularColor="#ffffff"
        />
      );
    }
    return (
      <meshPhysicalMaterial
        color={glassTint}
        metalness={0.02}
        roughness={0.08}
        transparent
        opacity={0.18}
        envMapIntensity={0.5}
        clearcoat={0.3}
      />
    );
  }, [highQuality, glassTint, glassThickness]);

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
        {glassMaterial}
      </mesh>
      {/* Back */}
      <mesh position={[0, 0, -d / 2 - glassThickness / 2]} geometry={panelGeom.frontBack}>
        <meshPhysicalMaterial
          color={glassTint}
          metalness={0}
          roughness={0.08}
          transmission={highQuality ? 0.88 : undefined}
          thickness={glassThickness}
          ior={highQuality ? 1.45 : undefined}
          envMapIntensity={0.4}
          transparent={!highQuality}
          opacity={highQuality ? undefined : 0.22}
        />
      </mesh>
      {/* Left */}
      <mesh position={[-w / 2 - glassThickness / 2, 0, 0]} geometry={panelGeom.side}>
        {glassMaterial}
      </mesh>
      {/* Right */}
      <mesh position={[w / 2 + glassThickness / 2, 0, 0]} geometry={panelGeom.side}>
        {glassMaterial}
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -h / 2 - glassThickness / 2, 0]} geometry={panelGeom.bottom} receiveShadow>
        <meshPhysicalMaterial
          color={glassTint}
          metalness={0}
          roughness={0.12}
          transmission={highQuality ? 0.85 : undefined}
          thickness={glassThickness}
          ior={highQuality ? 1.45 : undefined}
          envMapIntensity={0.3}
          transparent={!highQuality}
          opacity={highQuality ? undefined : 0.25}
        />
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

      {/* === WATER VOLUME === */}
      <mesh ref={waterRef} position={[0, 0, 0]}>
        <boxGeometry args={[w - 0.04, h - 0.06, d - 0.04]} />
        <meshPhysicalMaterial
          color={waterColor}
          metalness={0}
          roughness={0.05}
          transparent
          opacity={0.42}
          envMapIntensity={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* === WATER SURFACE === */}
      <mesh ref={surfaceRef} position={[0, h / 2 - 0.18, 0]} geometry={surfaceGeom}>
        <meshPhysicalMaterial
          color="#d8f0f8"
          roughness={0.02}
          metalness={0.08}
          transparent
          opacity={0.28}
          envMapIntensity={0.3}
          clearcoat={0.5}
          clearcoatRoughness={0.02}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
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
