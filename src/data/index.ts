import { freshwaterElements } from './freshwater';
import { marineElements } from './marine';
import type { AquariumElement, ElementCategory, WaterType } from '../types';

export { freshwaterElements, marineElements };

export function getElements(waterType: WaterType): AquariumElement[] {
  return waterType === 'freshwater' ? freshwaterElements : marineElements;
}

export function getElementsByCategory(waterType: WaterType, category: ElementCategory): AquariumElement[] {
  return getElements(waterType).filter(e => e.category === category);
}

export function getElementById(waterType: WaterType, id: string): AquariumElement | undefined {
  return getElements(waterType).find(e => e.id === id);
}

export const categoryLabels: Record<ElementCategory, string> = {
  substrate: 'Sol',
  decorations: 'Décorations',
  plants: 'Plantes',
  fish: 'Poissons',
  corals: 'Coraux',
  equipment: 'Équipement',
  accessories: 'Accessoires',
};

export const categoryIcons: Record<ElementCategory, string> = {
  substrate: '🏖️',
  decorations: '🏰',
  plants: '🌿',
  fish: '🐠',
  corals: '🪸',
  equipment: '⚙️',
  accessories: '🎀',
};

export const freshwaterCategories: ElementCategory[] = ['substrate', 'decorations', 'plants', 'fish', 'equipment'];
export const marineCategories: ElementCategory[] = ['substrate', 'decorations', 'corals', 'fish', 'equipment'];
