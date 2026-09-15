import { useRef, Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Lightformer, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useAquariumStore } from '../store';
import { tankDimensions, tankFloorY } from '../types';
import { getElementById } from '../data';
import { GlassTank } from './GlassTank';
import { TankStand } from './TankStand';
import { RoomEnvironment } from './RoomEnvironment';
import { SandFloor } from './SandFloor';
import { useTextureSafe, BACKGROUND_TEXTURES } from './textures';
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
  const w = dims.width;
  const barY = dims.height / 2 + 0.34;
  const postX = w / 2 + 0.16;
  const armHalf = (postX + (w / 2 - 0.09)) / 2; // centre du bras entre montant et barre
  return (
    <group>
      {/* Barre LED */}
      <group position={[0, barY, 0]}>
        <mesh castShadow>
          <boxGeometry args={[w - 0.18, 0.075, 0.09]} />
          <meshStandardMaterial color="#232323" roughness={0.25} metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.034, 0.035]}>
          <planeGeometry args={[w - 0.4, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.05} emissive="#ffffff" emissiveIntensity={intensity * 1.8} />
        </mesh>
      </group>
      {/* Supports en L fixés sur les bords du bac */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * postX, dims.height / 2 + 0.2, 0]} castShadow>
            <boxGeometry args={[0.07, 0.34, 0.07]} />
            <meshStandardMaterial color="#33343a" roughness={0.35} metalness={0.85} />
          </mesh>
          <mesh position={[s * armHalf, barY, 0]} castShadow>
            <boxGeometry args={[0.26, 0.06, 0.06]} />
            <meshStandardMaterial color="#33343a" roughness={0.35} metalness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const CAUSTIC_TILE = 512;

// Procedural caustic map for the spot light projector.
// Two tileable sine nets (A and B) are pre-rendered once side by side in a 1024px source
// canvas. Every frame the map canvas is re-composited from these nets at two drifting
// offsets (slightly different speeds => organic deformation), mimicking light refracting
// through an animated water surface. The spotlight samples this texture directly
// (three r185 SpotLight.map), so the sand receives a real projected, moving pattern.
function createCausticMap() {
  const tile = document.createElement('canvas');
  tile.width = tile.height = CAUSTIC_TILE * 2;
  const tctx = tile.getContext('2d')!;
  const img = tctx.createImageData(CAUSTIC_TILE, CAUSTIC_TILE);

  // Classic caustic web: product of two sheared sine nets. Integer frequencies keep the
  // tile seamless. Rendered as alpha-only (bright web over transparent), composited later.
  const renderNet = (f1: number, f2: number, f3: number, f4: number, shear: number, contrast: number, offsetX: number) => {
    for (let y = 0; y < CAUSTIC_TILE; y++) {
      for (let x = 0; x < CAUSTIC_TILE; x++) {
        const u = x / CAUSTIC_TILE;
        const v = y / CAUSTIC_TILE;
        const n1 = Math.sin(2 * Math.PI * (f1 * u + shear * Math.sin(2 * Math.PI * f2 * v)));
        const n2 = Math.sin(2 * Math.PI * (f3 * v + shear * Math.sin(2 * Math.PI * f4 * u)));
        const web = Math.pow(Math.max(0, (0.5 + 0.5 * n1) * (0.5 + 0.5 * n2)), contrast);
        const i = (y * CAUSTIC_TILE + x) * 4;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
        img.data[i + 3] = Math.round(web * 255);
      }
    }
    tctx.putImageData(img, offsetX, 0);
  };

  renderNet(5, 3, 4, 5, 1.15, 1.2, 0);      // net A — main web (large cells)
  renderNet(3, 4, 6, 3, 0.9, 0.9, CAUSTIC_TILE); // net B — secondary web (large cells)

  // Per-frame composite canvas (this one becomes the spotlight map).
  const map = document.createElement('canvas');
  map.width = map.height = CAUSTIC_TILE;
  const ctx = map.getContext('2d')!;
  const texture = new THREE.CanvasTexture(map);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const draw = (oA: { x: number; y: number }, oB: { x: number; y: number }) => {
    const s = CAUSTIC_TILE;
    // Dark base: keeps the sand between web filaments distinctly darker,
    // so the projected pattern reads with strong contrast.
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#262626';
    ctx.fillRect(0, 0, s, s);
    // Layer A — main web drifting at oA.
    const ax = (oA.x * s) - s;
    const ay = (oA.y * s) - s;
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        ctx.drawImage(tile, 0, 0, s, s, ax + k * s, ay + j * s, s, s);
      }
    }
    // Layer B — secondary web drifting at a different speed, added for depth.
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.55;
    const bx = (oB.x * s) - s;
    const by = (oB.y * s) - s;
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        ctx.drawImage(tile, s, 0, s, s, bx + k * s, by + j * s, s, s);
      }
    }
  };

  return {
    texture,
    draw,
    dispose: () => texture.dispose(),
  };
}

function CausticsProjector({ size, waterType, quality }: { size: import('../types').TankSize; waterType: import('../types').WaterType; quality: string }) {
  const dims = tankDimensions(size);
  const lightRef = useRef<THREE.SpotLight>(null);
  const enabled = quality !== 'low';
  const caustics = useMemo(() => createCausticMap(), []);
  useEffect(() => () => caustics.dispose(), [caustics]);

  useFrame(({ clock }) => {
    if (!enabled || !lightRef.current) return;
    const t = clock.elapsedTime;
    const norm = (v: number) => ((v % 1) + 1) % 1;
    // Two layers drifting at slightly different speeds and directions.
    caustics.draw(
      { x: norm(t * 0.012), y: norm(t * 0.008) },
      { x: norm(t * 0.0075), y: norm(-t * 0.013) },
    );
    caustics.texture.needsUpdate = true;
  });

  if (!enabled) return null;

  return (
    <spotLight
      ref={lightRef}
      position={[0, dims.height / 2 + 0.3, 0]}
      angle={0.9}
      penumbra={0.6}
      // decay 0/1 instead of the default 2: at this height the quadratic falloff would
      // swallow the projected pattern before it reaches the sand.
      decay={1}
      // Deliberately high: at 3.8 units above the sand, decay=1 divides the
      // intensity by the distance (~0.26x), which previously swallowed the
      // projected pattern entirely. Exaggerated on purpose for visibility.
      intensity={quality === 'high' ? 3.5 : 2.0}
      color={waterType === 'marine' ? '#88ccff' : '#aaddaa'}
      map={caustics.texture}
      castShadow
      shadow-mapSize-width={256}
      shadow-mapSize-height={256}
      shadow-bias={-0.001}
    />
  );
}

// Soft contact shadow under the tank: a radial gradient blob, cheap and stable.
// (drei's ContactShadows quad inherits the scene fog, which would smear it green.)
function SoftContactShadow({ footprint, y }: { footprint: [number, number]; y: number }) {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(0,0,0,0.85)');
    g.addColorStop(0.45, 'rgba(0,0,0,0.55)');
    g.addColorStop(0.8, 'rgba(0,0,0,0.16)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
      <planeGeometry args={[footprint[0] * 1.35, footprint[1] * 1.35]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} fog={false} />
    </mesh>
  );
}

// Décor de fond collé contre la paroi arrière intérieure du bac
// (comme une déco d'aquarium classique). Texture par type d'eau.
// fog={false} : le fond est une déco fixe, pas atténuée par l'eau
// (le recalibrage du fog le fondrait sinon, de face).
// La texture couvre tout le panneau (mode "cover" : crop sans déformation).
function AquariumBackdrop({ size, waterType }: { size: import('../types').TankSize; waterType: import('../types').WaterType }) {
  const dims = tankDimensions(size);
  const url = BACKGROUND_TEXTURES[waterType];
  const tex = useTextureSafe(url);

  const cover = useMemo(() => {
    if (!tex) return null;
    const img = tex.image as HTMLImageElement;
    const imgRatio = img.width / img.height;
    const panelRatio = dims.width / dims.height;
    const t = tex.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    if (imgRatio > panelRatio) {
      // image trop large : crop horizontal
      t.repeat.x = imgRatio / panelRatio;
      t.offset.x = (1 - 1 / t.repeat.x) / 2;
    } else {
      // image trop haute : crop vertical
      t.repeat.y = panelRatio / imgRatio;
      t.offset.y = (1 - 1 / t.repeat.y) / 2;
    }
    return t;
  }, [tex, dims]);

  if (!tex || !cover) return null;
  return (
    <mesh position={[0, 0, -dims.depth / 2 + 0.02]} renderOrder={-1}>
      <planeGeometry args={[dims.width, dims.height]} />
      <meshBasicMaterial map={cover} toneMapped={false} side={THREE.FrontSide} fog={false} />
    </mesh>
  );
}

// Vue initiale (mode 3D) adaptée à la taille du bac : frontale, légèrement
// décalée, avec assez de recul pour embrasser tout le décor.
function getCameraPos(size: import('../types').TankSize): [number, number, number] {
  switch (size) {
    case 'large': return [2.4, 3.05, 11.4];
    case 'medium': return [1.8, 2.7, 9.2];
    default: return [1.2, 2.3, 7.2];
  }
}

// Bascule 3D ↔ 2D : caméra perspective libre avec OrbitControls en 3D,
// caméra orthographique fixe de face en 2D (vue "fond d'écran").
// La position/target 3D est sauvegardée au passage en 2D et restaurée au retour.
function ViewModeRig({ size, viewMode, controlsRef }: {
  size: import('../types').TankSize;
  viewMode: '3d' | '2d';
  controlsRef: React.MutableRefObject<any>;
}) {
  const dims = tankDimensions(size);
  const { camera, size: vp } = useThree();
  const savedRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);

  useEffect(() => {
    if (viewMode === '2d' && !savedRef.current) {
      savedRef.current = {
        pos: camera.position.clone(),
        target: (controlsRef.current?.target ?? new THREE.Vector3(0, 0, 0)).clone(),
      };
    } else if (viewMode === '3d' && savedRef.current) {
      camera.position.copy(savedRef.current.pos);
      if (controlsRef.current) {
        controlsRef.current.target.copy(savedRef.current.target);
        controlsRef.current.update();
      }
      savedRef.current = null;
    }
  }, [viewMode, camera, controlsRef]);

  if (viewMode === '2d') {
    // Frustum orthographique : le bac remplit ~80% du cadre quel que soit l'écran
    const m = 1.22;
    const aspect = vp.width / Math.max(1, vp.height);
    let hw: number, hh: number;
    if (aspect > dims.width / dims.height) {
      hh = (dims.height / 2) * m;
      hw = hh * aspect;
    } else {
      hw = (dims.width / 2) * m;
      hh = hw / aspect;
    }
    return (
      <OrthographicCamera
        makeDefault
        position={[0, 0, 12]}
        near={0.1}
        far={100}
        left={-hw}
        right={hw}
        top={hh}
        bottom={-hh}
      />
    );
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={getCameraPos(size)} fov={45} near={0.1} far={200} />
      <OrbitControls
        ref={controlsRef}
        target={[0, -0.35, 0]}
        minDistance={dims.width * 0.8}
        maxDistance={dims.width * 3}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI * 0.75}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

function SceneContent() {
  const { state, dispatch } = useAquariumStore();
  const { config, placedElements, pumpEnabled, pumpIntensity, selectedElementId, showAdvancedEffects, graphicsQuality, cameraReset, lightOn } = state;
  const audio = useAudioSystem();

  // Hooks appelés inconditionnellement (avant le early return) — règles des hooks
  const controlsRef = useRef<any>(null);
  const prevPumpRef = useRef(pumpEnabled);

  if (!config) return null;

  const dims = tankDimensions(config.size);

  const substrateEl = placedElements.find(pe => {
    const e = config ? getElementById(config.waterType, pe.elementId) : undefined;
    return e?.category === 'substrate';
  });

  const handleClearSelection = () => dispatch({ type: 'SELECT_ELEMENT', instanceId: null });
  if (cameraReset && controlsRef.current) { controlsRef.current.reset(); dispatch({ type: 'CAMERA_RESET_DONE' }); }

  if (prevPumpRef.current !== pumpEnabled) { prevPumpRef.current = pumpEnabled; audio.setPumpState(pumpEnabled); }

  const lightIntensity = graphicsQuality === 'low' ? 0.5 : graphicsQuality === 'high' ? 1.2 : 0.9;

  return (
    <>
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

      {/* Pièce : sol + mur du fond + meuble sous le bac — masqués en vue 2D
          (fond d'écran épuré : le bac seul) */}
      {state.viewMode === '3d' && (
        <>
          <RoomEnvironment size={config.size} />
          <TankStand size={config.size} />
          {/* Ombre douce au pied du meuble */}
          <SoftContactShadow footprint={[dims.width + 1.6, dims.depth + 1.6]} y={tankFloorY(config.size) + 0.004} />
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
      <AquariumBackdrop size={config.size} waterType={config.waterType} />
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

      <ViewModeRig size={config.size} viewMode={state.viewMode} controlsRef={controlsRef} />

      <mesh position={[0, 0, -dims.depth]} onClick={handleClearSelection} visible={false}>
        <planeGeometry args={[dims.width * 3, dims.height * 3]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}

export function AquariumScene() {
  // Vue initiale adaptée à la taille du bac : frontale, légèrement décalée,
  // avec assez de recul pour embrasser tout le décor.
  const { state } = useAquariumStore();
  const cameraPos = useMemo(() => getCameraPos(state.config?.size ?? 'small'), [state.config?.size]);

  return (
    <Canvas
      camera={{ position: cameraPos, fov: 45 }}
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
