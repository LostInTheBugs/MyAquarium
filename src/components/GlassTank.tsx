import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TankSize, WaterType } from '../types';
import { tankDimensions } from '../types';

interface GlassTankProps {
  size: TankSize;
  waterType: WaterType;
}

export function GlassTank({ size, waterType }: GlassTankProps) {
  const dims = tankDimensions(size);
  const waterRef = useRef<THREE.Mesh>(null);
  const surfaceRef = useRef<THREE.Mesh>(null);

  const glassThickness = 0.1;
  const frameWidth = 0.08;
  const w = dims.width;
  const h = dims.height;
  const d = dims.depth;

  const waterColor = waterType === 'marine' ? '#0d4f6b' : '#2d6b4e';
  const frameColor = waterType === 'marine' ? '#1a2a33' : '#1a2a22';

  const surfaceGeom = useMemo(() => {
    const geom = new THREE.PlaneGeometry(w - 0.15, d - 0.15, 32, 32);
    geom.rotateX(-Math.PI / 2);
    return geom;
  }, [w, d]);

  useFrame(() => {
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.MeshPhysicalMaterial;
      mat.opacity = 0.38 + Math.sin(Date.now() * 0.0008) * 0.04;
    }
    // Animate water surface vertices
    if (surfaceRef.current) {
      const pos = (surfaceRef.current.geometry as THREE.PlaneGeometry).attributes.position;
      const t = Date.now() * 0.001;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getY(i);
        pos.setZ(i, Math.sin(x * 3 + t) * 0.015 + Math.cos(z * 2.5 + t * 1.3) * 0.012);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* === GLASS PANELS (thick) === */}
      {/* Front panel */}
      <mesh position={[0, 0, d / 2 + glassThickness / 2]} castShadow>
        <boxGeometry args={[w + glassThickness * 2, h, glassThickness]} />
        <meshPhysicalMaterial
          color="#c8e8f0"
          metalness={0.02}
          roughness={0.08}
          transparent
          opacity={0.18}
          envMapIntensity={0.6}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Back panel */}
      <mesh position={[0, 0, -d / 2 - glassThickness / 2]}>
        <boxGeometry args={[w + glassThickness * 2, h, glassThickness]} />
        <meshPhysicalMaterial
          color="#b0d4e0"
          metalness={0.02}
          roughness={0.08}
          transparent
          opacity={0.22}
          envMapIntensity={0.4}
        />
      </mesh>
      {/* Left panel */}
      <mesh position={[-w / 2 - glassThickness / 2, 0, 0]} castShadow>
        <boxGeometry args={[glassThickness, h, d]} />
        <meshPhysicalMaterial
          color="#c0dce8"
          metalness={0.02}
          roughness={0.08}
          transparent
          opacity={0.16}
          envMapIntensity={0.5}
        />
      </mesh>
      {/* Right panel */}
      <mesh position={[w / 2 + glassThickness / 2, 0, 0]} castShadow>
        <boxGeometry args={[glassThickness, h, d]} />
        <meshPhysicalMaterial
          color="#c0dce8"
          metalness={0.02}
          roughness={0.08}
          transparent
          opacity={0.16}
          envMapIntensity={0.5}
        />
      </mesh>
      {/* Bottom panel */}
      <mesh position={[0, -h / 2 - glassThickness / 2, 0]} receiveShadow>
        <boxGeometry args={[w, glassThickness, d]} />
        <meshPhysicalMaterial
          color="#b8d8e4"
          metalness={0.02}
          roughness={0.1}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* === METAL FRAME BEZELS (top and bottom rims) === */}
      {/* Top frame rim */}
      <mesh position={[0, h / 2 + frameWidth / 2, 0]} castShadow>
        <boxGeometry args={[w + glassThickness * 2 + frameWidth, frameWidth, d + glassThickness * 2 + frameWidth]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Bottom frame rim */}
      <mesh position={[0, -h / 2 - glassThickness - frameWidth / 2, 0]} receiveShadow>
        <boxGeometry args={[w + glassThickness * 2 + frameWidth, frameWidth, d + glassThickness * 2 + frameWidth]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* === CORNER POSTS === */}
      {[
        [-w / 2 - glassThickness, h / 2, -d / 2 - glassThickness],
        [w / 2 + glassThickness, h / 2, -d / 2 - glassThickness],
        [-w / 2 - glassThickness, h / 2, d / 2 + glassThickness],
        [w / 2 + glassThickness, h / 2, d / 2 + glassThickness],
      ].map(([cx, , cz], i) => (
        <mesh key={`corner-${i}`} position={[cx, 0, cz]} castShadow>
          <boxGeometry args={[frameWidth * 0.6, h + frameWidth * 2, frameWidth * 0.6]} />
          <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.7} />
        </mesh>
      ))}

      {/* Vertical edge strips */}
      {[
        [-w / 2 - glassThickness, 0, -d / 2 - glassThickness - frameWidth * 0.2],
        [w / 2 + glassThickness, 0, -d / 2 - glassThickness - frameWidth * 0.2],
        [-w / 2 - glassThickness, 0, d / 2 + glassThickness + frameWidth * 0.2],
        [w / 2 + glassThickness, 0, d / 2 + glassThickness + frameWidth * 0.2],
        [-w / 2 - glassThickness - frameWidth * 0.2, 0, -d / 2 - glassThickness],
        [w / 2 + glassThickness + frameWidth * 0.2, 0, -d / 2 - glassThickness],
        [-w / 2 - glassThickness - frameWidth * 0.2, 0, d / 2 + glassThickness],
        [w / 2 + glassThickness + frameWidth * 0.2, 0, d / 2 + glassThickness],
      ].map(([ex, ey, ez], i) => (
        <mesh key={`edge-${i}`} position={[ex, ey, ez]}>
          <boxGeometry args={[frameWidth * 0.25, h + frameWidth * 0.5, frameWidth * 0.25]} />
          <meshStandardMaterial color={frameColor} roughness={0.35} metalness={0.65} />
        </mesh>
      ))}

      {/* === WATER VOLUME === */}
      <mesh ref={waterRef} position={[0, 0, 0]} name="water-volume">
        <boxGeometry args={[w - 0.04, h - 0.04, d - 0.04]} />
        <meshPhysicalMaterial
          color={waterColor}
          metalness={0}
          roughness={0.05}
          transparent
          opacity={0.38}
          envMapIntensity={0.25}
        />
      </mesh>

      {/* === WATER SURFACE (animated plane on top) === */}
      <mesh ref={surfaceRef} position={[0, h / 2 - 0.15, 0]} geometry={surfaceGeom}>
        <meshPhysicalMaterial
          color="#c8e8f8"
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.3}
          envMapIntensity={0.8}
          clearcoat={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glass edge highlights (thin lines at panel seams) */}
      {[
        { pos: [0, 0, d / 2], rot: [0, 0, 0], scale: [w, h, 1] },
        { pos: [0, 0, -d / 2], rot: [0, 0, 0], scale: [w, h, 1] },
        { pos: [-w / 2, 0, 0], rot: [0, Math.PI / 2, 0], scale: [d, h, 1] },
        { pos: [w / 2, 0, 0], rot: [0, Math.PI / 2, 0], scale: [d, h, 1] },
      ].map((panel, i) => (
        <mesh key={`highlight-${i}`} position={panel.pos as [number, number, number]} rotation={panel.rot as [number, number, number]}>
          <planeGeometry args={panel.scale as [number, number]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
