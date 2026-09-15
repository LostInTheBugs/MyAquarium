import type { WaterType } from '../types';

/**
 * Aquariums vitrine pré-remplis (grande taille), composés comme dans une
 * boutique : substrat + plantes/coraux foisonnants, 2-3 objets, un banc de
 * poissons, équipement avec bulles.
 *
 * Coordonnées pour le bac large (8 × 5 × 4) : sol à y = -2.37. Les éléments
 * posés au sol sont ancrés par leur base (voir Plant/Coral/RockSprite).
 */

export interface PresetElement {
  elementId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export interface AquariumPreset {
  waterType: WaterType;
  elements: PresetElement[];
  pumpEnabled: boolean;
}

const SOL = -2.37;

export const PRESETS: Record<WaterType, AquariumPreset> = {
  freshwater: {
    waterType: 'freshwater',
    pumpEnabled: true,
    elements: [
      // --- Substrat ---
      { elementId: 'sand-light', position: [0, -0.85, 0], rotation: [0, 0, 0], scale: 1 },

      // --- Plantes : rideau d'arrière-plan + avant-scène ---
      { elementId: 'vallisneria', position: [-3.5, SOL, -1.5], rotation: [0, 0.2, 0], scale: 1 },
      { elementId: 'vallisneria', position: [-3.7, SOL, -0.4], rotation: [0, 0.6, 0], scale: 0.9 },
      { elementId: 'vallisneria', position: [3.5, SOL, -1.5], rotation: [0, -0.2, 0], scale: 1 },
      { elementId: 'vallisneria', position: [3.7, SOL, -0.5], rotation: [0, -0.6, 0], scale: 0.9 },
      { elementId: 'java-fern', position: [-1.8, SOL, -1.7], rotation: [0, 0.4, 0], scale: 1 },
      { elementId: 'java-fern', position: [1.8, SOL, -1.7], rotation: [0, -0.4, 0], scale: 1 },
      { elementId: 'red-plant', position: [-0.9, SOL, -1.6], rotation: [0, 0.3, 0], scale: 1 },
      { elementId: 'red-plant', position: [0.9, SOL, -1.6], rotation: [0, -0.3, 0], scale: 1 },
      { elementId: 'anubias', position: [-2.6, SOL, 0.3], rotation: [0, 0.8, 0], scale: 1 },
      { elementId: 'anubias', position: [2.6, SOL, 0.3], rotation: [0, -0.8, 0], scale: 1 },
      { elementId: 'grass', position: [-2.8, SOL, 1.4], rotation: [0, 0, 0], scale: 1.1 },
      { elementId: 'grass', position: [0, SOL, 1.5], rotation: [0, 0.3, 0], scale: 1.2 },
      { elementId: 'grass', position: [2.8, SOL, 1.4], rotation: [0, -0.2, 0], scale: 1.1 },
      { elementId: 'moss', position: [0.5, SOL, 0.4], rotation: [0, 0, 0], scale: 1.5 },

      // --- Objets (3) ---
      { elementId: 'root', position: [0, SOL, -1.0], rotation: [0, 0.5, 0], scale: 1.6 },
      { elementId: 'amphora', position: [-3.0, SOL, 1.1], rotation: [0, 0.8, 0], scale: 1.3 },
      { elementId: 'statue', position: [3.0, SOL, 1.2], rotation: [0, -0.5, 0], scale: 1.2 },

      // --- Poissons : banc + espèces variées ---
      { elementId: 'neon-tetra', position: [-2.5, -0.8, -0.8], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'neon-tetra', position: [2.8, 0.2, 0.3], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'neon-tetra', position: [0.6, -1.2, 1.0], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'neon-tetra', position: [-1.2, 0.9, 0.1], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'neon-tetra', position: [3.2, -0.3, -0.6], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'neon-tetra', position: [-0.4, 1.3, -0.4], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'guppy', position: [1.6, -0.9, 1.2], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'guppy', position: [-2.9, 0.4, 1.1], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'guppy', position: [0.1, 0.2, -0.2], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'angelfish', position: [-1.6, 0.5, -1.1], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'angelfish', position: [2.1, 1.0, -0.9], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'molly', position: [1.0, -1.3, -1.2], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'molly', position: [-0.8, -1.0, 1.4], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'corydoras', position: [-1.1, -2.1, 0.8], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'corydoras', position: [1.9, -2.05, -0.5], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'goldfish', position: [0.3, -0.7, 1.6], rotation: [0, 0, 0], scale: 1 },

      // --- Équipement (posé au sol, coin arrière-gauche) ---
      { elementId: 'air-pump', position: [-3.4, SOL, -1.5], rotation: [0, 0, 0], scale: 1 },
    ],
  },

  marine: {
    waterType: 'marine',
    pumpEnabled: true,
    elements: [
      // --- Substrat ---
      { elementId: 'marine-sand', position: [0, -0.85, 0], rotation: [0, 0, 0], scale: 1 },

      // --- Objets (3) ---
      { elementId: 'shipwreck-marine', position: [0, SOL, -1.2], rotation: [0, 0.3, 0], scale: 1.7 },
      { elementId: 'statue-marine', position: [-2.7, SOL, 0.8], rotation: [0, 0.6, 0], scale: 1.2 },
      { elementId: 'amphora-marine', position: [2.8, SOL, 1.0], rotation: [0, -0.4, 0], scale: 1.2 },

      // --- Coraux & invertébrés ---
      { elementId: 'brain-coral', position: [-1.9, SOL, -1.6], rotation: [0, 0.4, 0], scale: 1.2 },
      { elementId: 'brain-coral', position: [2.1, SOL, -1.5], rotation: [0, -0.5, 0], scale: 1.1 },
      { elementId: 'branch-coral', position: [-3.3, SOL, -0.7], rotation: [0, 0.7, 0], scale: 1.2 },
      { elementId: 'branch-coral', position: [3.3, SOL, -0.8], rotation: [0, -0.7, 0], scale: 1.2 },
      { elementId: 'branch-coral', position: [0.6, SOL, -1.6], rotation: [0, 0.2, 0], scale: 1 },
      { elementId: 'colorful-coral', position: [-1.3, SOL, 0.4], rotation: [0, 0.3, 0], scale: 1.1 },
      { elementId: 'colorful-coral', position: [1.5, SOL, 0.6], rotation: [0, -0.3, 0], scale: 1.1 },
      { elementId: 'anemone', position: [-0.9, SOL, -1.3], rotation: [0, 0, 0], scale: 1.2 },
      { elementId: 'anemone', position: [1.3, SOL, -1.2], rotation: [0, 0.5, 0], scale: 1.2 },
      { elementId: 'starfish', position: [-2.6, -2.4, 1.4], rotation: [0, 0.8, 0], scale: 1.3 },
      { elementId: 'starfish', position: [2.7, -2.4, 1.3], rotation: [0, -0.4, 0], scale: 1.2 },
      { elementId: 'urchin', position: [0.4, SOL, 1.4], rotation: [0, 0.3, 0], scale: 1.2 },
      { elementId: 'crab', position: [1.9, SOL, 1.1], rotation: [0, -0.6, 0], scale: 1.3 },
      { elementId: 'shrimp', position: [-3.4, SOL, 1.2], rotation: [0, 0.5, 0], scale: 1.2 },
      { elementId: 'shrimp', position: [3.4, SOL, 1.4], rotation: [0, -0.3, 0], scale: 1.2 },
      { elementId: 'shrimp', position: [0.0, SOL, 0.7], rotation: [0, 0.9, 0], scale: 1 },

      // --- Poissons ---
      { elementId: 'clownfish', position: [-2.2, -1.0, -0.6], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'clownfish', position: [2.4, 0.4, 0.4], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'clownfish', position: [0.5, -1.3, 1.0], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'clownfish', position: [-1.0, 1.1, -0.2], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'blue-tang', position: [-0.8, 0.2, -1.1], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'blue-tang', position: [2.6, -0.5, 0.9], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'butterflyfish', position: [1.4, 0.8, -0.8], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'butterflyfish', position: [-2.6, 0.6, 0.5], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'goby', position: [-1.5, -2.0, 1.1], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'goby', position: [2.9, -1.9, -0.7], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'goby', position: [0.2, -1.9, 0.3], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'damselfish', position: [3.0, 0.9, -0.3], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'damselfish', position: [-3.0, 1.0, -0.9], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'damselfish', position: [0.8, -0.4, -1.4], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'damselfish', position: [-0.6, 0.0, 1.5], rotation: [0, 0, 0], scale: 1 },

      // --- Équipement (posé au sol, coins arrière) ---
      { elementId: 'skimmer', position: [-3.4, SOL, -1.5], rotation: [0, 0, 0], scale: 1 },
      { elementId: 'air-pump', position: [3.4, SOL, -1.5], rotation: [0, 0, 0], scale: 1 },
    ],
  },
};
