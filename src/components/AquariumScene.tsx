import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useAquariumStore } from '../store';
import { tankDimensions } from '../types';
import { getElementById } from '../data';
import { GlassTank } from './GlassTank';
import { SandFloor } from './SandFloor';
import { Fish } from './Fish';
import { Plant } from './Plant';
import { Coral } from './Coral';
import { Decoration } from './Decoration';
import { Equipment } from './Equipment';
import { BubbleSystem } from './BubbleSystem';
import { ParticleSystem } from './ParticleSystem';
import { useAudioSystem } from '../hooks/useAudioSystem';

function CausticsLight({ size, waterType }: { size: import('../types').TankSize; waterType: import('../types').WaterType }) {
  const dims = tankDimensions(size);
  const lightRef = useRef<THREE.SpotLight>(null);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity = 0.25 + Math.sin(Date.now() * 0.002) * 0.08;
    }
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, dims.height / 2 + 0.5, 0]}
      angle={0.8}
      penumbra={0.5}
      intensity={0.3}
      color={waterType === 'marine' ? '#88ccff' : '#aaddaa'}
      castShadow
      shadow-mapSize-width={512}
      shadow-mapSize-height={512}
    />
  );
}

function LEDRamp({ size, lightOn }: { size: import('../types').TankSize; lightOn: boolean }) {
  const dims = tankDimensions(size);
  if (!lightOn) return null;

  return (
    <group position={[0, dims.height / 2 + 0.15, 0]}>
      {/* LED ramp housing */}
      <mesh castShadow>
        <boxGeometry args={[dims.width - 0.2, 0.06, 0.08]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* LED strip (emissive) */}
      <mesh position={[0, -0.02, 0.04]}>
        <planeGeometry args={[dims.width - 0.4, 0.02]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.1}
          emissive="#eeffff"
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Side brackets */}
      {[[-dims.width / 2 + 0.2, 0.02], [dims.width / 2 - 0.2, 0.02]].map(([bx, bz], i) => (
        <mesh key={`bracket-${i}`} position={[bx, -0.05, bz]}>
          <cylinderGeometry args={[0.02, 0.03, 0.1, 8]} />
          <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function LightRays({ size, waterType }: { size: import('../types').TankSize; waterType: import('../types').WaterType }) {
  const dims = tankDimensions(size);
  const rays = useMemo(() => {
    return Array.from({ length: 6 }, () => ({
      x: (Math.random() - 0.5) * dims.width * 0.6,
      z: (Math.random() - 0.5) * dims.depth * 0.6,
      width: 0.04 + Math.random() * 0.08,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [dims]);

  return (
    <group>
      {rays.map((ray, idx) => (
        <mesh
          key={`ray-${idx}`}
          position={[ray.x, 0, ray.z]}
          rotation={[0.05 + Math.random() * 0.1, 0, Math.random() * 0.3]}
        >
          <planeGeometry args={[ray.width, dims.height * 0.8]} />
          <meshBasicMaterial
            color={waterType === 'marine' ? '#88aadd' : '#aacc88'}
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent() {
  const { state, dispatch } = useAquariumStore();
  const { config, placedElements, pumpEnabled, pumpIntensity, selectedElementId, showAdvancedEffects, graphicsQuality, cameraReset, lightOn } = state;
  const audio = useAudioSystem();

  if (!config) return null;

  const dims = tankDimensions(config.size);
  const substrateEl = placedElements.find(pe => {
    const e = config ? getElementById(config.waterType, pe.elementId) : undefined;
    return e?.category === 'substrate';
  });

  const handleClearSelection = () => dispatch({ type: 'SELECT_ELEMENT', instanceId: null });

  const controlsRef = useRef<any>(null);
  if (cameraReset && controlsRef.current) {
    controlsRef.current.reset();
    dispatch({ type: 'CAMERA_RESET_DONE' });
  }

  // Sync pump state with audio
  const prevPumpRef = useRef(pumpEnabled);
  if (prevPumpRef.current !== pumpEnabled) {
    prevPumpRef.current = pumpEnabled;
    audio.setPumpState(pumpEnabled);
  }

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={lightOn ? 0.25 : 0.05} color={config.waterType === 'marine' ? '#6688aa' : '#88aa88'} />

      {/* Main directional light (sunlight through water) */}
      {lightOn && (
        <>
          <directionalLight
            position={[0, dims.height + 1, dims.depth * 0.3]}
            intensity={0.8}
            color="#ffffff"
            castShadow={graphicsQuality !== 'low'}
            shadow-mapSize-width={graphicsQuality === 'high' ? 1024 : 512}
            shadow-mapSize-height={graphicsQuality === 'high' ? 1024 : 512}
            shadow-camera-far={dims.height * 3}
            shadow-camera-left={-dims.width}
            shadow-camera-right={dims.width}
            shadow-camera-top={dims.height}
            shadow-camera-bottom={-dims.height}
            shadow-bias={-0.0005}
          />
          <pointLight position={[0, dims.height * 0.5, dims.depth * 0.3]} intensity={0.4} color="#ccddff" />
          <pointLight position={[-dims.width * 0.3, dims.height * 0.1, -dims.depth * 0.3]} intensity={0.2} color={config.waterType === 'marine' ? '#2255aa' : '#225544'} />

          {/* Caustics spotlight */}
          <CausticsLight size={config.size} waterType={config.waterType} />

          {/* Light rays */}
          <LightRays size={config.size} waterType={config.waterType} />
        </>
      )}

      {/* Environment */}
      <Environment preset="sunset" />

      {/* LED ramp on top */}
      <LEDRamp size={config.size} lightOn={lightOn} />

      {/* Glass tank */}
      <GlassTank size={config.size} waterType={config.waterType} />

      {/* Sand floor */}
      <SandFloor size={config.size} waterType={config.waterType} substrateType={substrateEl?.elementId} />

      {/* Placed elements */}
      {placedElements.filter(pe => {
        const e = getElementById(config.waterType, pe.elementId);
        return e?.category !== 'substrate';
      }).map(pe => {
        const element = getElementById(config.waterType, pe.elementId);
        if (!element) return null;

        const isSelected = selectedElementId === pe.instanceId;

        switch (element.category) {
          case 'fish':
            return (
              <Fish key={pe.instanceId} modelType={element.modelType} position={pe.position}
                scale={pe.scale} instanceId={pe.instanceId} tankSize={config.size}
                isSelected={isSelected}
                onSelect={() => dispatch({ type: 'SELECT_ELEMENT', instanceId: pe.instanceId })} />
            );
          case 'plants':
            return (
              <Plant key={pe.instanceId} modelType={element.modelType} position={pe.position}
                scale={pe.scale} isSelected={isSelected}
                onSelect={() => dispatch({ type: 'SELECT_ELEMENT', instanceId: pe.instanceId })} />
            );
          case 'corals':
            return (
              <Coral key={pe.instanceId} modelType={element.modelType} position={pe.position}
                scale={pe.scale} isSelected={isSelected}
                onSelect={() => dispatch({ type: 'SELECT_ELEMENT', instanceId: pe.instanceId })} />
            );
          case 'decorations':
            return (
              <Decoration key={pe.instanceId} modelType={element.modelType} position={pe.position}
                scale={pe.scale} isSelected={isSelected}
                onSelect={() => dispatch({ type: 'SELECT_ELEMENT', instanceId: pe.instanceId })} />
            );
          case 'equipment':
            return (
              <Equipment key={pe.instanceId} modelType={element.modelType} position={pe.position}
                scale={pe.scale} isSelected={isSelected}
                onSelect={() => dispatch({ type: 'SELECT_ELEMENT', instanceId: pe.instanceId })}
                pumpActive={element.modelType === 'air-pump' && pumpEnabled} />
            );
          default:
            return null;
        }
      })}

      {/* Bubble system with pump device */}
      <BubbleSystem enabled={pumpEnabled} intensity={pumpIntensity} size={config.size} />
      {showAdvancedEffects && (
        <ParticleSystem enabled={showAdvancedEffects} waterType={config.waterType} size={config.size} />
      )}

      <OrbitControls ref={controlsRef} target={[0, 0, 0]}
        minDistance={dims.width * 0.8} maxDistance={dims.width * 3}
        minPolarAngle={0.2} maxPolarAngle={Math.PI * 0.7}
        enableDamping dampingFactor={0.1} />

      <mesh position={[0, 0, -dims.depth]} onClick={handleClearSelection} visible={false}>
        <planeGeometry args={[dims.width * 3, dims.height * 3]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}

export function AquariumScene() {
  return (
    <Canvas
      camera={{ position: [8, 4, 8], fov: 50 }}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{ background: 'radial-gradient(circle at center, #0a2a3a 0%, #02111a 100%)' }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
