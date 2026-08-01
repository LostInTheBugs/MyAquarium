import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Lightformer } from '@react-three/drei';
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

function LEDRamp({ size, lightOn, intensity }: { size: import('../types').TankSize; lightOn: boolean; intensity: number }) {
  const dims = tankDimensions(size);
  if (!lightOn) return null;
  return (
    <group position={[0, dims.height / 2 + 0.12, 0]}>
      <mesh castShadow>
        <boxGeometry args={[dims.width - 0.2, 0.05, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh position={[0, -0.02, 0.03]}>
        <planeGeometry args={[dims.width - 0.5, 0.015]} />
        <meshStandardMaterial color="#ffffff" roughness={0.05} emissive="#ffffff" emissiveIntensity={intensity * 1.5} />
      </mesh>
    </group>
  );
}

function CausticsProjector({ size, waterType, quality }: { size: import('../types').TankSize; waterType: import('../types').WaterType; quality: string }) {
  const dims = tankDimensions(size);
  const lightRef = useRef<THREE.SpotLight>(null);
  if (quality === 'low') return null;

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity = quality === 'high' ? 0.35 + Math.sin(Date.now() * 0.0015) * 0.1 : 0.2;
    }
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, dims.height / 2 + 0.3, 0]}
      angle={0.9}
      penumbra={0.6}
      intensity={quality === 'high' ? 0.35 : 0.2}
      color={waterType === 'marine' ? '#88ccff' : '#aaddaa'}
      castShadow
      shadow-mapSize-width={256}
      shadow-mapSize-height={256}
      shadow-bias={-0.001}
    />
  );
}

function SceneContent() {
  const { state, dispatch } = useAquariumStore();
  const { config, placedElements, pumpEnabled, pumpIntensity, selectedElementId, showAdvancedEffects, graphicsQuality, cameraReset, lightOn } = state;
  const audio = useAudioSystem();

  if (!config) return null;

  const dims = tankDimensions(config.size);

  // Water depth fog — linear attenuation recalibrated per frame to camera distance.
  // Ensures fog only acts across the tank depth, not the camera-to-tank distance.
  const fogColor = config.waterType === 'marine' ? '#4a6a7a' : '#4a6a5a';

  // Recalibrate fog near/far every frame based on actual camera distance to tank centre.
  // This keeps attenuation strictly across the tank depth regardless of zoom/orbit.
  useFrame(({ scene, camera }) => {
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      const d = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      const halfDepth = dims.depth / 2;
      scene.fog.near = Math.max(0.5, d - halfDepth);
      scene.fog.far = d + halfDepth;
    }
  });

  const substrateEl = placedElements.find(pe => {
    const e = config ? getElementById(config.waterType, pe.elementId) : undefined;
    return e?.category === 'substrate';
  });

  const handleClearSelection = () => dispatch({ type: 'SELECT_ELEMENT', instanceId: null });
  const controlsRef = useRef<any>(null);
  if (cameraReset && controlsRef.current) { controlsRef.current.reset(); dispatch({ type: 'CAMERA_RESET_DONE' }); }

  const prevPumpRef = useRef(pumpEnabled);
  if (prevPumpRef.current !== pumpEnabled) { prevPumpRef.current = pumpEnabled; audio.setPumpState(pumpEnabled); }

  const lightIntensity = graphicsQuality === 'low' ? 0.5 : graphicsQuality === 'high' ? 1.2 : 0.9;

  return (
    <>
      {/* Water depth fog — linear, recalculated per frame based on camera distance */}
      <fog attach="fog" args={[fogColor, 5, 15]} />

      {/* Ambient */}
      <ambientLight intensity={lightOn ? 0.2 : 0.03} color={config.waterType === 'marine' ? '#5577aa' : '#669966'} />

      {lightOn && (
        <>
          {/* Main directional light */}
          <directionalLight
            position={[0, dims.height + 1, dims.depth * 0.3]}
            intensity={lightIntensity}
            color={config.waterType === 'marine' ? '#ddeeff' : '#ffeedd'}
            castShadow={graphicsQuality !== 'low'}
            shadow-mapSize-width={graphicsQuality === 'high' ? 2048 : 1024}
            shadow-mapSize-height={graphicsQuality === 'high' ? 2048 : 1024}
            shadow-camera-far={dims.height * 4}
            shadow-camera-left={-dims.width * 1.5}
            shadow-camera-right={dims.width * 1.5}
            shadow-camera-top={dims.height * 1.5}
            shadow-camera-bottom={-dims.height * 1.5}
            shadow-bias={-0.0004}
            shadow-normalBias={0.02}
          />
          {/* Fill lights */}
          <pointLight position={[dims.width * 0.3, dims.height * 0.3, dims.depth * 0.3]} intensity={0.3} color="#ccddff" />
          <pointLight position={[-dims.width * 0.3, dims.height * 0.3, -dims.depth * 0.3]} intensity={0.2} color={config.waterType === 'marine' ? '#3366aa' : '#334433'} />
          {/* Caustics */}
          <CausticsProjector size={config.size} waterType={config.waterType} quality={graphicsQuality} />
        </>
      )}

      {/* LED ramp on top */}
      <LEDRamp size={config.size} lightOn={lightOn} intensity={lightIntensity} />

      {/* Controlled environment map for glass transmission/reflections — no outdoor imagery */}
      <Environment background={false} resolution={256}>
        {/* Overhead: mimics LED ramp, strong warm white */}
        <Lightformer
          position={[0, dims.height / 2 + 0.4, 0]}
          scale={[dims.width * 0.9, dims.depth * 0.6, 1]}
          intensity={4}
          color="#fff5e8"
          form="rect"
          rotation-x={Math.PI / 2}
        />
        {/* Left side: cool dim vertical, gives glass its edge reading */}
        <Lightformer
          position={[-dims.width / 2 - 0.4, 0, 0]}
          scale={[dims.depth * 0.55, dims.height * 0.65, 1]}
          intensity={0.6}
          color="#8899bb"
          form="rect"
          rotation-y={Math.PI / 2}
        />
        {/* Right side: cool dim vertical, symmetric */}
        <Lightformer
          position={[dims.width / 2 + 0.4, 0, 0]}
          scale={[dims.depth * 0.55, dims.height * 0.65, 1]}
          intensity={0.6}
          color="#8899bb"
          form="rect"
          rotation-y={-Math.PI / 2}
        />
        {/* Below: dark, prevents uniformly bright glass */}
        <Lightformer
          position={[0, -dims.height / 2 - 0.4, 0]}
          scale={[dims.width * 0.75, dims.depth * 0.5, 1]}
          intensity={0.12}
          color="#111122"
          form="rect"
          rotation-x={-Math.PI / 2}
        />
      </Environment>

      <GlassTank size={config.size} waterType={config.waterType} graphicsQuality={graphicsQuality} />
      <SandFloor size={config.size} waterType={config.waterType} substrateType={substrateEl?.elementId} graphicsQuality={graphicsQuality} />

      {/* Elements */}
      {placedElements.filter(pe => { const e = getElementById(config.waterType, pe.elementId); return e?.category !== 'substrate'; }).map(pe => {
        const element = getElementById(config.waterType, pe.elementId);
        if (!element) return null;
        const isSelected = selectedElementId === pe.instanceId;
        switch (element.category) {
          case 'fish': return <Fish key={pe.instanceId} modelType={element.modelType} position={pe.position} scale={pe.scale} instanceId={pe.instanceId} tankSize={config.size} isSelected={isSelected} onSelect={() => dispatch({ type: 'SELECT_ELEMENT', instanceId: pe.instanceId })} />;
          case 'plants': return <Plant key={pe.instanceId} modelType={element.modelType} position={pe.position} scale={pe.scale} isSelected={isSelected} onSelect={() => dispatch({ type: 'SELECT_ELEMENT', instanceId: pe.instanceId })} />;
          case 'corals': return <Coral key={pe.instanceId} modelType={element.modelType} position={pe.position} scale={pe.scale} isSelected={isSelected} onSelect={() => dispatch({ type: 'SELECT_ELEMENT', instanceId: pe.instanceId })} />;
          case 'decorations': return <Decoration key={pe.instanceId} modelType={element.modelType} position={pe.position} scale={pe.scale} isSelected={isSelected} onSelect={() => dispatch({ type: 'SELECT_ELEMENT', instanceId: pe.instanceId })} />;
          case 'equipment': return <Equipment key={pe.instanceId} modelType={element.modelType} position={pe.position} scale={pe.scale} isSelected={isSelected} onSelect={() => dispatch({ type: 'SELECT_ELEMENT', instanceId: pe.instanceId })} pumpActive={element.modelType === 'air-pump' && pumpEnabled} />;
          default: return null;
        }
      })}

      <BubbleSystem enabled={pumpEnabled} intensity={pumpIntensity} size={config.size} quality={graphicsQuality} />
      {showAdvancedEffects && graphicsQuality !== 'low' && (
        <ParticleSystem enabled={showAdvancedEffects} waterType={config.waterType} size={config.size} />
      )}

      <OrbitControls ref={controlsRef} target={[0, 0, 0]} minDistance={dims.width * 0.8} maxDistance={dims.width * 3} minPolarAngle={0.15} maxPolarAngle={Math.PI * 0.75} enableDamping dampingFactor={0.08} />

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
      camera={{ position: [7, 3.5, 8], fov: 45 }}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ background: 'radial-gradient(circle at center top, #0d2a4a 0%, #051020 100%)' }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
