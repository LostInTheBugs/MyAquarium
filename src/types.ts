export type WaterType = 'freshwater' | 'marine';
export type TankSize = 'small' | 'medium' | 'large';

export type ElementCategory =
  | 'decorations'
  | 'substrate'
  | 'plants'
  | 'fish'
  | 'corals'
  | 'equipment'
  | 'accessories';

export interface AquariumElement {
  id: string;
  name: string;
  category: ElementCategory;
  waterType: WaterType | 'both';
  minTankSize: TankSize;
  maxCount: number;
  description: string;
  rarity?: 'common' | 'uncommon' | 'rare';
  icon: string;
  modelType: string;
  /** Fiche d'information éducative (page Découverte), sources Fishipedia */
  info?: {
    scientificName: string;
    size: string;       // taille adulte, ex. "3-4 cm"
    behavior: string;   // sociabilité, ex. "banc", "solitaire"
    diet: string;       // régime, ex. "omnivore"
    longevity?: string; // ex. "5 ans"
    origin?: string;    // ex. "Bassin amazonien"
    status?: string;    // statut IUCN, ex. "LC"
  };
}

export interface PlacedElement {
  instanceId: string;
  elementId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export interface TankConfig {
  waterType: WaterType;
  size: TankSize;
}

export interface TankDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface AquariumState {
  config: TankConfig | null;
  placedElements: PlacedElement[];
  pumpEnabled: boolean;
  pumpIntensity: 'low' | 'medium' | 'high';
  selectedElementId: string | null;
  activeCategory: ElementCategory | null;
  graphicsQuality: 'low' | 'medium' | 'high';
  showAdvancedEffects: boolean;
  cameraReset: boolean;
  lightOn: boolean;
  viewMode: '3d' | '2d';
}

export function tankDimensions(size: TankSize): TankDimensions {
  switch (size) {
    case 'small': return { width: 4, height: 2.5, depth: 2 };
    case 'medium': return { width: 6, height: 3.5, depth: 3 };
    case 'large': return { width: 8, height: 5, depth: 4 };
  }
}

export function maxFishCount(size: TankSize): number {
  switch (size) {
    case 'small': return 5;
    case 'medium': return 12;
    case 'large': return 25;
  }
}

/** Hauteur du meuble sous le bac selon la taille (unités monde). */
export function standHeight(size: TankSize): number {
  switch (size) {
    case 'large': return 0.62;
    case 'medium': return 0.55;
    default: return 0.48;
  }
}

/** Écart entre le bas du bac (cadre inférieur) et le haut du meuble. */
export const STAND_GAP = 0.18;

/** Altitude du sol de la pièce (sous le meuble). */
export function tankFloorY(size: TankSize): number {
  const dims = tankDimensions(size);
  return -dims.height / 2 - STAND_GAP - standHeight(size);
}
