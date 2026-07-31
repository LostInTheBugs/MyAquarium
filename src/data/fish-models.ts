import type { WaterType } from '../types';

export interface FishModelConfig {
  id: string;
  name: string;
  species: string;
  waterType: WaterType;
  /** Path to GLTF/GLB model, relative to /public/models/fish/ */
  gltfPath?: string;
  /** Procedural fallback model type */
  proceduralType: string;
  /** Base scale (relative to tank size) */
  baseScale: number;
  /** Swim speed multiplier */
  speed: number;
  /** Schooling: max group size before they spread out */
  maxGroupSize: number;
  /** Preferred depth zone: 'surface' | 'mid' | 'bottom' */
  depthZone: 'surface' | 'mid' | 'bottom';
}

export const fishModels: FishModelConfig[] = [
  // === FRESHWATER ===
  {
    id: 'neon-tetra', name: 'Néon', species: 'Paracheirodon innesi',
    waterType: 'freshwater', gltfPath: 'neon-tetra.glb', proceduralType: 'fish-neon',
    baseScale: 1.0, speed: 0.7, maxGroupSize: 8, depthZone: 'mid',
  },
  {
    id: 'guppy', name: 'Guppy', species: 'Poecilia reticulata',
    waterType: 'freshwater', gltfPath: 'guppy.glb', proceduralType: 'fish-guppy',
    baseScale: 1.1, speed: 0.5, maxGroupSize: 6, depthZone: 'mid',
  },
  {
    id: 'angelfish', name: 'Scalaire', species: 'Pterophyllum scalare',
    waterType: 'freshwater', gltfPath: 'angelfish.glb', proceduralType: 'fish-angelfish',
    baseScale: 1.8, speed: 0.3, maxGroupSize: 3, depthZone: 'mid',
  },
  {
    id: 'betta', name: 'Combattant', species: 'Betta splendens',
    waterType: 'freshwater', gltfPath: 'betta.glb', proceduralType: 'fish-betta',
    baseScale: 1.5, speed: 0.25, maxGroupSize: 1, depthZone: 'surface',
  },
  {
    id: 'molly', name: 'Molly', species: 'Poecilia sphenops',
    waterType: 'freshwater', gltfPath: 'molly.glb', proceduralType: 'fish-molly',
    baseScale: 1.2, speed: 0.5, maxGroupSize: 5, depthZone: 'mid',
  },
  {
    id: 'corydoras', name: 'Corydoras', species: 'Corydoras aeneus',
    waterType: 'freshwater', gltfPath: 'corydoras.glb', proceduralType: 'fish-cory',
    baseScale: 0.9, speed: 0.6, maxGroupSize: 5, depthZone: 'bottom',
  },
  {
    id: 'goldfish', name: 'Poisson rouge', species: 'Carassius auratus',
    waterType: 'freshwater', gltfPath: 'goldfish.glb', proceduralType: 'fish-gold',
    baseScale: 1.6, speed: 0.35, maxGroupSize: 3, depthZone: 'mid',
  },
  // === MARINE ===
  {
    id: 'clownfish', name: 'Poisson-clown', species: 'Amphiprion ocellaris',
    waterType: 'marine', gltfPath: 'clownfish.glb', proceduralType: 'fish-clown',
    baseScale: 1.2, speed: 0.45, maxGroupSize: 3, depthZone: 'mid',
  },
  {
    id: 'blue-tang', name: 'Chirurgien bleu', species: 'Paracanthurus hepatus',
    waterType: 'marine', gltfPath: 'blue-tang.glb', proceduralType: 'fish-tang',
    baseScale: 1.6, speed: 0.55, maxGroupSize: 3, depthZone: 'mid',
  },
  {
    id: 'butterflyfish', name: 'Poisson-papillon', species: 'Chaetodon',
    waterType: 'marine', gltfPath: 'butterflyfish.glb', proceduralType: 'fish-butterfly',
    baseScale: 1.4, speed: 0.4, maxGroupSize: 2, depthZone: 'mid',
  },
  {
    id: 'goby', name: 'Gobie', species: 'Gobiidae',
    waterType: 'marine', gltfPath: 'goby.glb', proceduralType: 'fish-goby',
    baseScale: 0.8, speed: 0.5, maxGroupSize: 4, depthZone: 'bottom',
  },
  {
    id: 'damselfish', name: 'Poisson-demoiselle', species: 'Pomacentridae',
    waterType: 'marine', gltfPath: 'damselfish.glb', proceduralType: 'fish-damsel',
    baseScale: 0.9, speed: 0.65, maxGroupSize: 5, depthZone: 'mid',
  },
];

export function getFishConfig(elementId: string): FishModelConfig | undefined {
  return fishModels.find(f => f.id === elementId);
}
