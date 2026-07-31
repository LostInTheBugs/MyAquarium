import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TankSize } from '../types';
import { tankDimensions } from '../types';

interface ParticleSystemProps {
  enabled: boolean;
  waterType: 'freshwater' | 'marine';
  size: TankSize;
}

export function ParticleSystem({ enabled, waterType, size }: ParticleSystemProps) {
  const dims = tankDimensions(size);
  const pointsRef = useRef<THREE.Points>(null);
  const count = 300;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * dims.width;
      pos[i * 3 + 1] = -dims.height / 2 + Math.random() * dims.height;
      pos[i * 3 + 2] = (Math.random() - 0.5) * dims.depth;
    }
    return pos;
  }, [count, dims]);

  const color = waterType === 'marine' ? '#aaccff' : '#ccffcc';

  useFrame((_, delta) => {
    if (!pointsRef.current || !enabled) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const halfH = dims.height / 2;
    const halfW = dims.width / 2;
    const halfD = dims.depth / 2;
    const t = Date.now() * 0.0003;

    for (let i = 0; i < count; i++) {
      pos[i * 3] += Math.sin(t + i * 0.1) * delta * 0.05;
      pos[i * 3 + 1] += Math.cos(t * 0.7 + i * 0.15) * delta * 0.03;
      pos[i * 3 + 2] += Math.cos(t * 0.9 + i * 0.12) * delta * 0.04;

      if (pos[i * 3] > halfW) pos[i * 3] = -halfW;
      if (pos[i * 3] < -halfW) pos[i * 3] = halfW;
      if (pos[i * 3 + 1] > halfH) pos[i * 3 + 1] = -halfH;
      if (pos[i * 3 + 1] < -halfH) pos[i * 3 + 1] = halfH;
      if (pos[i * 3 + 2] > halfD) pos[i * 3 + 2] = -halfD;
      if (pos[i * 3 + 2] < -halfD) pos[i * 3 + 2] = halfD;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.015}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
